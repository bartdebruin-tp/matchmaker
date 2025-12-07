import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}))

describe('Groups Store', () => {
  let groupsStore: ReturnType<typeof useGroupsStore>
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    groupsStore = useGroupsStore()
    authStore = useAuthStore()
    
    // Mock authenticated user
    authStore.user = {
      id: 'test-user-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as any
  })

  describe('fetchGroups', () => {
    it('should fetch groups and their relationships from Supabase', async () => {
      const mockGroups = [
        { id: 'g1', user_id: 'test-user-id', name: 'Group 1', color: 'bg-blue-500', created_at: '2025-01-01T00:00:00Z' },
        { id: 'g2', user_id: 'test-user-id', name: 'Group 2', color: 'bg-red-500', created_at: '2025-01-02T00:00:00Z' }
      ]

      const mockGroupPlayers = [
        { group_id: 'g1', player_id: 'p1' },
        { group_id: 'g1', player_id: 'p2' },
        { group_id: 'g2', player_id: 'p3' }
      ]

      const mockActivePlayers = [
        { player_id: 'p1' },
        { player_id: 'p3' }
      ]

      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockImplementation((table: string) => {
        if (table === 'groups') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockGroups, error: null })
          } as any
        } else if (table === 'group_players') {
          return {
            select: vi.fn().mockResolvedValue({ data: mockGroupPlayers, error: null })
          } as any
        } else if (table === 'active_players') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockActivePlayers, error: null })
          } as any
        }
        return {} as any
      })

      await groupsStore.fetchGroups()

      expect(groupsStore.groups).toHaveLength(2)
      expect(groupsStore.groups[0].playerIds).toEqual(['p1', 'p2'])
      expect(groupsStore.groups[1].playerIds).toEqual(['p3'])
      expect(groupsStore.activePlayerIds.has('p1')).toBe(true)
      expect(groupsStore.activePlayerIds.has('p3')).toBe(true)
    })

    it('should handle errors when fetching groups', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database error' } 
        })
      } as any)

      await expect(groupsStore.fetchGroups()).rejects.toThrow()
    })
  })

  describe('addGroup', () => {
    it('should add a new group to Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const group = await groupsStore.addGroup('New Group', 'bg-green-500')

      expect(group.name).toBe('New Group')
      expect(group.color).toBe('bg-green-500')
      expect(group.playerIds).toEqual([])
      expect(groupsStore.groups).toHaveLength(1)
    })

    it('should throw error if not authenticated', async () => {
      authStore.user = null

      await expect(groupsStore.addGroup('Group', 'bg-blue-500')).rejects.toThrow('Not authenticated')
    })
  })

  describe('updateGroup', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.addGroup('Test Group', 'bg-blue-500')
    })

    it('should update a group in Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      const groupId = groupsStore.groups[0].id
      await groupsStore.updateGroup(groupId, 'Updated Group', 'bg-red-500')

      expect(groupsStore.groups[0].name).toBe('Updated Group')
      expect(groupsStore.groups[0].color).toBe('bg-red-500')
    })
  })

  describe('deleteGroup', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.addGroup('Test Group', 'bg-blue-500')
    })

    it('should delete a group from Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      const groupId = groupsStore.groups[0].id
      await groupsStore.deleteGroup(groupId)

      expect(groupsStore.groups).toHaveLength(0)
    })
  })

  describe('addPlayerToGroup', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.addGroup('Test Group', 'bg-blue-500')
    })

    it('should add a player to a group', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const groupId = groupsStore.groups[0].id
      await groupsStore.addPlayerToGroup(groupId, 'player1')

      expect(groupsStore.groups[0].playerIds).toContain('player1')
    })

    it('should not add duplicate player to group', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const groupId = groupsStore.groups[0].id
      await groupsStore.addPlayerToGroup(groupId, 'player1')
      
      // Try to add same player again
      await groupsStore.addPlayerToGroup(groupId, 'player1')

      expect(groupsStore.groups[0].playerIds.filter(id => id === 'player1')).toHaveLength(1)
    })
  })

  describe('removePlayerFromGroup', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.addGroup('Test Group', 'bg-blue-500')
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)
      
      await groupsStore.addPlayerToGroup(groupsStore.groups[0].id, 'player1')
    })

    it('should remove a player from a group', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      const groupId = groupsStore.groups[0].id
      await groupsStore.removePlayerFromGroup(groupId, 'player1')

      expect(groupsStore.groups[0].playerIds).not.toContain('player1')
    })
  })

  describe('setActivePlayer', () => {
    it('should set a player as active', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.setActivePlayer('player1', true)

      expect(groupsStore.activePlayerIds.has('player1')).toBe(true)
    })

    it('should set a player as inactive', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.setActivePlayer('player1', true)
      
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      await groupsStore.setActivePlayer('player1', false)

      expect(groupsStore.activePlayerIds.has('player1')).toBe(false)
    })
  })

  describe('toggleActivePlayer', () => {
    it('should toggle player active status', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.toggleActivePlayer('player1')
      expect(groupsStore.activePlayerIds.has('player1')).toBe(true)

      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      await groupsStore.toggleActivePlayer('player1')
      expect(groupsStore.activePlayerIds.has('player1')).toBe(false)
    })
  })

  describe('clearActivePlayers', () => {
    it('should clear all active players', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.setActivePlayer('player1', true)
      await groupsStore.setActivePlayer('player2', true)

      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await groupsStore.clearActivePlayers()

      expect(groupsStore.activePlayerIds.size).toBe(0)
    })
  })

  describe('getGroupById', () => {
    beforeEach(() => {
      groupsStore.setGroups([
        { id: 'g1', name: 'Group 1', color: 'bg-blue-500', playerIds: [], createdAt: Date.now() },
        { id: 'g2', name: 'Group 2', color: 'bg-red-500', playerIds: [], createdAt: Date.now() }
      ])
    })

    it('should return group by id', () => {
      const group = groupsStore.getGroupById('g1')
      expect(group).toBeDefined()
      expect(group?.name).toBe('Group 1')
    })

    it('should return undefined for non-existent id', () => {
      const group = groupsStore.getGroupById('g999')
      expect(group).toBeUndefined()
    })
  })

  describe('getGroupsByPlayerId', () => {
    beforeEach(() => {
      groupsStore.setGroups([
        { id: 'g1', name: 'Group 1', color: 'bg-blue-500', playerIds: ['p1', 'p2'], createdAt: Date.now() },
        { id: 'g2', name: 'Group 2', color: 'bg-red-500', playerIds: ['p2', 'p3'], createdAt: Date.now() },
        { id: 'g3', name: 'Group 3', color: 'bg-green-500', playerIds: ['p3'], createdAt: Date.now() }
      ])
    })

    it('should return groups containing the player', () => {
      const groups = groupsStore.getGroupsByPlayerId('p2')
      expect(groups).toHaveLength(2)
      expect(groups.map(g => g.name)).toEqual(['Group 1', 'Group 2'])
    })

    it('should return empty array if player not in any groups', () => {
      const groups = groupsStore.getGroupsByPlayerId('p999')
      expect(groups).toHaveLength(0)
    })
  })
})
