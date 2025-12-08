-- Fix for "Database error saving new user" issue
-- This script adds a public.users table and trigger to handle new user signups
-- Run this in your Supabase SQL Editor

-- Step 1: Create a public users table (optional, but recommended for user metadata)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for public.users
DO $$ 
BEGIN
  -- Drop policies if they exist (for re-running script)
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
  
  -- Create policies
  CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);
END $$;

-- Step 4: Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create a trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Backfill existing users (if any)
INSERT INTO public.users (id, email, created_at, updated_at)
SELECT id, email, created_at, updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Verification query - run this to check if everything works
-- SELECT COUNT(*) as user_count FROM public.users;
-- Should match the count from auth.users

COMMENT ON TABLE public.users IS 'Public user profiles - automatically created on signup';
COMMENT ON FUNCTION public.handle_new_user IS 'Trigger function to create user profile on signup';
