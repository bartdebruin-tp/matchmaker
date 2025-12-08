# Match Type and Sub-Pages Feature

This document describes the match type and sub-pages feature for groups in the MatchMaker application.

## Overview

Groups can now be configured with one of two match types:

1. **Random Matches** - Generate random match pairings automatically
2. **Scheduled** - Create sub-pages to track player attendance across multiple sessions

## Match Types

### Random Matches (Default)

When creating a group with "Random Matches" mode:
- You can generate random match pairings from active players
- The existing match generation functionality works as before
- Best for casual gaming sessions where you want automatic pairing

### Scheduled

When creating a group with "Scheduled" mode:
- Match generation is disabled
- You can create multiple sub-pages for different sessions/dates
- Each sub-page tracks which players are present
- Best for leagues, tournaments, or scheduled play sessions where you need attendance tracking

## Creating Groups with Match Types

1. Navigate to the Groups page
2. Click "Create Group"
3. Enter a group name
4. Choose a color
5. Select the match type:
   - **Random Matches**: For automatic match generation
   - **Scheduled**: For attendance tracking across sessions
6. Click "Create"

## Working with Sub-Pages (Scheduled Groups Only)

### Creating a Sub-Page

1. Open a scheduled group
2. Click "Create Session" or similar button
3. Enter a session name (e.g., "Week 1", "Tournament Round 1")
4. Optionally set a date
5. Click "Create"

### Tracking Attendance

1. Open a sub-page
2. You'll see all players in the group
3. Click on players to mark them as present/absent
4. Present players will be highlighted
5. Attendance is saved automatically

### Managing Sub-Pages

- **Edit**: Update the session name or date
- **Delete**: Remove a session (confirmation required)
- **View**: See which players attended past sessions

## Database Schema

### Groups Table Update

```sql
ALTER TABLE groups ADD COLUMN match_type TEXT NOT NULL DEFAULT 'random';
```

### New Tables

#### sub_pages
```sql
CREATE TABLE sub_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### sub_page_players
```sql
CREATE TABLE sub_page_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_page_id UUID NOT NULL REFERENCES sub_pages(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sub_page_id, player_id)
);
```

## Migration

If you have an existing database, run the migration script:

```bash
# Run the migration script in your Supabase SQL Editor
cat database_migration.sql
```

Or manually run the SQL commands from `database_migration.sql` in your Supabase dashboard.

## API Reference

### Types

```typescript
// Group type with match type
interface Group {
  id: string
  name: string
  color: string
  playerIds: string[]
  matchType: 'random' | 'scheduled'
  createdAt: number
}

// Sub-page for scheduled groups
interface SubPage {
  id: string
  groupId: string
  name: string
  date?: number
  presentPlayerIds: string[]
  createdAt: number
}
```

### Store Methods

#### Groups Store

```typescript
// Create group with match type
addGroup(name: string, color: string, matchType: 'random' | 'scheduled'): Promise<Group>

// Update group including match type
updateGroup(id: string, name: string, color: string, matchType: 'random' | 'scheduled'): Promise<void>
```

#### Sub-Pages Store

```typescript
// Fetch sub-pages for a group
fetchSubPages(groupId?: string): Promise<void>

// Create a new sub-page
addSubPage(groupId: string, name: string, date?: number): Promise<SubPage>

// Update sub-page
updateSubPage(id: string, name: string, date?: number): Promise<void>

// Delete sub-page
deleteSubPage(id: string): Promise<void>

// Mark player as present/absent
togglePlayerPresent(subPageId: string, playerId: string): Promise<void>

// Get sub-pages for a group
getSubPagesByGroupId(groupId: string): SubPage[]
```

## Use Cases

### League/Tournament Management

1. Create a group with "Scheduled" match type
2. Add all league participants to the group
3. Create a sub-page for each week/round
4. Track attendance for each session
5. View historical attendance data

### Casual Gaming Sessions

1. Create a group with "Random Matches" match type
2. Add players to the group
3. Mark active players before each session
4. Generate random match pairings
5. Play your matches!

### Hybrid Approach

You can create multiple groups with different match types:
- A "Weekly League" group (scheduled) for organized play
- A "Casual Games" group (random) for drop-in sessions

## Testing

Unit tests are provided for both features:

```bash
# Run all tests
npm test

# Run specific test files
npm test groups.test.ts
npm test subPages.test.ts
```

## Future Enhancements

Possible future additions:
- Match results tracking on sub-pages
- Attendance statistics and reports
- Calendar view for scheduled sessions
- Automated reminders for upcoming sessions
- Export attendance data
- Player availability management

## Troubleshooting

### Sub-pages not appearing

- Verify the group has `matchType: 'scheduled'`
- Check that sub-pages are being fetched with the correct `groupId`
- Ensure RLS policies are properly set up in Supabase

### Cannot create sub-pages

- Verify you're authenticated
- Check that the group exists and belongs to the current user
- Review Supabase logs for RLS policy violations

### TypeScript errors

- Run `npm run build` to check for compilation errors
- Ensure Supabase types are up to date (see `src/types/supabase.ts`)
- Regenerate types if needed using Supabase CLI

## Support

For issues or questions:
1. Check the documentation in `SUPABASE_SETUP.md`
2. Review the migration script in `database_migration.sql`
3. Examine test files for usage examples
4. Check Supabase dashboard for database issues
