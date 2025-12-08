# Authentication Troubleshooting Guide

## "Database error saving new user" Error

### Problem
When trying to register a new user, you receive the error:
```json
{
  "code": "unexpected_failure",
  "message": "Database error saving new user"
}
```

### Root Cause
This error occurs when Supabase cannot complete the user signup process due to missing database triggers or functions that are expected to run after user creation. Common causes:

1. **Missing `public.users` table** - Supabase often expects a public users table to store user metadata
2. **Missing trigger function** - No `handle_new_user()` function to process new signups
3. **Missing trigger** - No trigger attached to `auth.users` table
4. **RLS policy issues** - Restrictive policies preventing the trigger from executing

### Solution

Run the SQL script in `fix_auth_trigger.sql` in your Supabase SQL Editor. This script:

1. Creates a `public.users` table for user metadata
2. Sets up proper RLS policies
3. Creates a `handle_new_user()` trigger function
4. Attaches the trigger to `auth.users` table
5. Backfills any existing users

### Step-by-Step Fix

1. **Open Supabase Dashboard**
   - Go to your project at [supabase.com](https://supabase.com)
   - Navigate to SQL Editor

2. **Run the Fix Script**
   - Copy the entire contents of `fix_auth_trigger.sql`
   - Paste into a new SQL query
   - Click "Run" or press Ctrl+Enter

3. **Verify the Fix**
   ```sql
   -- Check if the users table exists
   SELECT COUNT(*) FROM public.users;
   
   -- Check if the trigger exists
   SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   
   -- Check if the function exists
   SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
   ```

4. **Test Registration**
   - Try signing up with a new email address
   - You should now be able to register successfully

### Alternative: Manual Verification

If you want to manually check your Supabase setup:

1. **Check for public.users table:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'users';
   ```

2. **Check for triggers:**
   ```sql
   SELECT * FROM pg_trigger 
   WHERE tgrelid = 'auth.users'::regclass;
   ```

3. **Check for handle_new_user function:**
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name = 'handle_new_user';
   ```

### Prevention

When setting up a new Supabase project, always:

1. Run the complete `SUPABASE_SETUP.md` script (updated version includes the fix)
2. Test user registration before deploying
3. Check Supabase logs for any errors during signup

## Other Common Authentication Issues

### "Invalid login credentials"
- **Cause**: Wrong email/password or user doesn't exist
- **Solution**: Double-check credentials or use password reset

### "Email not confirmed"
- **Cause**: User hasn't clicked confirmation link
- **Solution**: Check email (including spam) or resend confirmation
- **Admin Override**: Disable email confirmation in Supabase (not recommended for production)

### "User already registered"
- **Cause**: Attempting to sign up with existing email
- **Solution**: Use sign in instead, or reset password if forgotten

### OAuth Redirect Issues
- **Cause**: Redirect URL not configured in Supabase
- **Solution**: Add your URLs to Authentication > URL Configuration:
  - Site URL: `http://localhost:5173` (dev) or your production URL
  - Redirect URLs: Add all allowed redirect URLs

### RLS Policy Errors
- **Cause**: Row Level Security blocking operations
- **Solution**: Check RLS policies in Database > Tables
  - Ensure policies use `auth.uid()` correctly
  - Verify policies exist for all CRUD operations needed

### Session/Token Issues
- **Cause**: Expired or invalid session tokens
- **Solution**: 
  ```typescript
  // Force session refresh
  await supabase.auth.refreshSession()
  
  // Or sign out and sign in again
  await supabase.auth.signOut()
  ```

## Debugging Tips

### 1. Check Browser Console
- Open DevTools (F12)
- Look for error messages
- Check Network tab for failed requests

### 2. Check Supabase Logs
- Go to Supabase Dashboard > Logs
- Filter by "Auth" to see authentication events
- Look for error messages

### 3. Test with Supabase Client
```typescript
// In browser console or test file
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'test123456'
})
console.log('Data:', data)
console.log('Error:', error)
```

### 4. Verify Environment Variables
```typescript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### 5. Test Database Connection
```sql
-- In Supabase SQL Editor
SELECT version(); -- Should return PostgreSQL version
SELECT auth.uid(); -- Should return NULL when not authenticated
```

## Getting Help

If you're still experiencing issues:

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Supabase Documentation**: [supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
3. **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
4. **GitHub Issues**: Include:
   - Error message
   - Steps to reproduce
   - Browser console logs
   - Supabase logs (sanitized)

## Quick Checklist

Before deploying to production:

- [ ] `public.users` table created
- [ ] `handle_new_user()` trigger function exists
- [ ] Trigger attached to `auth.users`
- [ ] RLS enabled on all tables
- [ ] RLS policies configured correctly
- [ ] Email confirmation tested
- [ ] OAuth providers configured (if using)
- [ ] Redirect URLs configured
- [ ] Environment variables set
- [ ] Test registration works
- [ ] Test login works
- [ ] Test password reset works
- [ ] Test sign out works
