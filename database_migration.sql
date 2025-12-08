-- Migration script to add match_type and sub-pages functionality
-- Run this script in your Supabase SQL Editor if you have an existing database

-- Step 1: Add match_type column to groups table
ALTER TABLE groups ADD COLUMN IF NOT EXISTS match_type TEXT NOT NULL DEFAULT 'random';

-- Step 2: Create sub_pages table
CREATE TABLE IF NOT EXISTS sub_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create sub_page_players table
CREATE TABLE IF NOT EXISTS sub_page_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_page_id UUID NOT NULL REFERENCES sub_pages(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sub_page_id, player_id)
);

-- Step 4: Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_sub_pages_group_id ON sub_pages(group_id);
CREATE INDEX IF NOT EXISTS idx_sub_page_players_sub_page_id ON sub_page_players(sub_page_id);
CREATE INDEX IF NOT EXISTS idx_sub_page_players_player_id ON sub_page_players(player_id);

-- Step 5: Enable RLS on new tables
ALTER TABLE sub_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_page_players ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for sub_pages
DO $$ 
BEGIN
  -- Drop policies if they exist (for re-running script)
  DROP POLICY IF EXISTS "Users can view sub-pages for their groups" ON sub_pages;
  DROP POLICY IF EXISTS "Users can insert sub-pages for their groups" ON sub_pages;
  DROP POLICY IF EXISTS "Users can update sub-pages for their groups" ON sub_pages;
  DROP POLICY IF EXISTS "Users can delete sub-pages for their groups" ON sub_pages;
  
  -- Create policies
  CREATE POLICY "Users can view sub-pages for their groups"
    ON sub_pages FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM groups
        WHERE groups.id = sub_pages.group_id
        AND groups.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can insert sub-pages for their groups"
    ON sub_pages FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM groups
        WHERE groups.id = sub_pages.group_id
        AND groups.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can update sub-pages for their groups"
    ON sub_pages FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM groups
        WHERE groups.id = sub_pages.group_id
        AND groups.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can delete sub-pages for their groups"
    ON sub_pages FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM groups
        WHERE groups.id = sub_pages.group_id
        AND groups.user_id = auth.uid()
      )
    );
END $$;

-- Step 7: Create RLS policies for sub_page_players
DO $$ 
BEGIN
  -- Drop policies if they exist (for re-running script)
  DROP POLICY IF EXISTS "Users can view sub-page-players for their groups" ON sub_page_players;
  DROP POLICY IF EXISTS "Users can insert sub-page-players for their groups" ON sub_page_players;
  DROP POLICY IF EXISTS "Users can delete sub-page-players for their groups" ON sub_page_players;
  
  -- Create policies
  CREATE POLICY "Users can view sub-page-players for their groups"
    ON sub_page_players FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM sub_pages
        JOIN groups ON groups.id = sub_pages.group_id
        WHERE sub_pages.id = sub_page_players.sub_page_id
        AND groups.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can insert sub-page-players for their groups"
    ON sub_page_players FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM sub_pages
        JOIN groups ON groups.id = sub_pages.group_id
        WHERE sub_pages.id = sub_page_players.sub_page_id
        AND groups.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can delete sub-page-players for their groups"
    ON sub_page_players FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM sub_pages
        JOIN groups ON groups.id = sub_pages.group_id
        WHERE sub_pages.id = sub_page_players.sub_page_id
        AND groups.user_id = auth.uid()
      )
    );
END $$;

-- Migration complete!
-- You can now use the match_type field on groups and create sub-pages for scheduled groups.
