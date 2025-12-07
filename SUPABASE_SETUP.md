# Supabase Database Setup Guide

This document provides step-by-step instructions for setting up the Supabase database for the MatchMaker application.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials from Project Settings > API:
   - `VITE_SUPABASE_URL`: Your project URL (e.g., `https://xxxxx.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your anon/public key

3. Update the `.env` file with your credentials.

## Database Schema

Run the following SQL commands in the Supabase SQL Editor (Project Dashboard > SQL Editor).

### 1. Create Tables

```sql
-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group-Player relationships (many-to-many)
CREATE TABLE group_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, player_id)
);

-- Active players tracking
CREATE TABLE active_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, player_id)
);
```

### 2. Create Indexes

```sql
-- Indexes for better query performance
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_groups_user_id ON groups(user_id);
CREATE INDEX idx_group_players_group_id ON group_players(group_id);
CREATE INDEX idx_group_players_player_id ON group_players(player_id);
CREATE INDEX idx_active_players_user_id ON active_players(user_id);
CREATE INDEX idx_active_players_player_id ON active_players(player_id);
```

### 3. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_players ENABLE ROW LEVEL SECURITY;
```

### 4. Create RLS Policies

```sql
-- Players policies
CREATE POLICY "Users can view their own players"
  ON players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own players"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own players"
  ON players FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own players"
  ON players FOR DELETE
  USING (auth.uid() = user_id);

-- Groups policies
CREATE POLICY "Users can view their own groups"
  ON groups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own groups"
  ON groups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own groups"
  ON groups FOR DELETE
  USING (auth.uid() = user_id);

-- Group-Players policies
CREATE POLICY "Users can view group-players for their groups"
  ON group_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_players.group_id
      AND groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert group-players for their groups"
  ON group_players FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_players.group_id
      AND groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete group-players for their groups"
  ON group_players FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_players.group_id
      AND groups.user_id = auth.uid()
    )
  );

-- Active players policies
CREATE POLICY "Users can view their own active players"
  ON active_players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own active players"
  ON active_players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own active players"
  ON active_players FOR DELETE
  USING (auth.uid() = user_id);
```

## Authentication Setup

### 1. Enable OAuth Providers

In your Supabase dashboard, go to Authentication > Providers:

#### Google OAuth
1. Enable Google provider
2. Follow Supabase's instructions to create OAuth credentials in Google Cloud Console
3. Add your authorized redirect URIs:
   - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - For local development: `http://localhost:5173` (or your dev port)

#### Facebook OAuth
1. Enable Facebook provider
2. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
3. Add Facebook Login product
4. Configure OAuth redirect URI:
   - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
5. Enter your Facebook App ID and App Secret in Supabase

### 2. Configure Email Authentication

1. In Authentication > Providers, enable Email provider
2. Configure email templates if desired (Settings > Auth > Email Templates)
3. Set Site URL and Redirect URLs in Settings > Auth:
   - Site URL: Your production URL
   - Redirect URLs: Add your development and production URLs

## Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` and try:
   - Signing up with email/password
   - Logging in with Google
   - Logging in with Facebook

3. After authentication, you should be redirected to the home page

4. Test creating players and groups - they should sync to Supabase

## Verifying Data

Check your Supabase dashboard:
1. Go to Table Editor
2. Select each table (players, groups, group_players, active_players)
3. Verify that data is being saved correctly

## Troubleshooting

### "Invalid Redirect URL" Error
- Ensure your redirect URLs are configured in Authentication > URL Configuration
- Add both `http://localhost:5173` and your production URL

### RLS Errors
- Check that all RLS policies are created correctly
- Verify that `auth.uid()` matches the `user_id` in your policies

### OAuth Not Working
- Verify OAuth credentials are correct
- Check that redirect URIs match exactly
- Ensure OAuth apps are in production mode (not test mode)

### Data Not Syncing
- Check browser console for errors
- Verify environment variables are loaded correctly
- Test Supabase connection with a simple query in the SQL Editor

## Data Migration

If you have existing local data:

1. Export data from Settings page
2. The exported JSON will have players and groups
3. After authenticating, you can manually import by:
   - Using the Upload Data feature (will need modification to sync to Supabase)
   - Or manually creating entries through the app UI

## Security Best Practices

1. **Never commit `.env` file** - it contains sensitive credentials
2. **Use RLS policies** - Always enabled for production
3. **Validate on server** - RLS policies provide server-side validation
4. **Rotate keys** - Regularly rotate your service role key (not anon key)
5. **Monitor usage** - Check Supabase dashboard for unusual activity

## Next Steps

- Set up Supabase Storage for file uploads (if needed)
- Configure email templates for better user experience
- Set up Supabase Edge Functions for complex operations
- Enable database backups in project settings
- Set up monitoring and alerts

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
