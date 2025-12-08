# 🔧 Quick Fix: "Database error saving new user"

## The Problem
Getting error when registering new users:
```
{code: "unexpected_failure", message: "Database error saving new user"}
```

## The Solution (2 minutes)

### 1. Open Supabase SQL Editor
- Go to your Supabase project dashboard
- Click on "SQL Editor" in the left sidebar

### 2. Run the Fix Script
- Open the file `fix_auth_trigger.sql` in this project
- Copy the entire contents
- Paste into a new SQL query in Supabase
- Click "Run" button

### 3. Test It
- Go back to your app
- Try registering a new user
- Should work now! ✅

## What This Does
The script creates:
- A `public.users` table for user profiles
- A trigger function that runs when new users sign up
- Proper security policies

## Need More Help?
See `AUTH_TROUBLESHOOTING.md` for detailed debugging steps.

## Update Your Setup Process
The `SUPABASE_SETUP.md` file has been updated to include this fix for new projects.
