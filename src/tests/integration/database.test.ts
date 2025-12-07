import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePlayersStore } from '@/stores/players'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'

// Mock data that will be shared across tests
const mockData = {
  players: [] as any[],
  groups: [] as any[],
  groupPlayers: [] as any[],
  activePlayers: [] as any[]
}

// Mock Supabase
vi.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: (table: string) => ({
        select: function(_columns?: string) {
          return {
            eq: (_column: string, value: any) => ({
              order: (_orderCol: string, _options?: any) => {
                if (table === 'players') {
                  return Promise.resolve({ 
                    data: mockData.players.filter(p => p.user_id === value),
                    error: null 
                  })
                } else if (table === 'groups') {
                  return Promise.resolve({ 
                    data: mockData.groups.filter(g => g.user_id === value),
                    error: null 
                  })
                } else if (table === 'active_players') {
                  return Promise.resolve({ 
                    data: mockData.activePlayers.filter(ap => ap.user_id === value),
                    error: null 
                  })
                }
                return Promise.resolve({ data: [], error: null })
              }
            })
          }
        },
        insert: (data: any) => {
          if (table === 'players') {
            mockData.players.push(data)
          } else if (table === 'groups') {
            mockData.groups.push(data)
          } else if (table === 'group_players') {
            mockData.groupPlayers.push(data)
          } else if (table === 'active_players') {
            mockData.activePlayers.push(data)
          }
          return Promise.resolve({ data: null, error: null })
        },
        update: (updates: any) => ({
          eq: (_column: string, value: any) => ({
            eq: (_column2: string, value2: any) => {
              if (table === 'players') {
                const player = mockData.players.find(p => p.id === value && p.user_id === value2)
                if (player) Object.assign(player, updates)
              } else if (table === 'groups') {
                const group = mockData.groups.find(g => g.id === value && g.user_id === value2)
                if (group) Object.assign(group, updates)
              }
              return Promise.resolve({ data: null, error: null })
            }
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            eq: (column2: string, value2: any) => {
              if (table === 'players') {
                mockData.players = mockData.players.filter(p => !(p.id === value && p.user_id === value2))
              } else if (table === 'groups') {
                mockData.groups = mockData.groups.filter(g => !(g.id === value && g.user_id === value2))
              } else if (table === 'group_players') {
                mockData.groupPlayers = mockData.groupPlayers.filter(
                  gp => !(gp[column] === value && gp[column2] === value2)
                )
              } else if (table === 'active_players') {
                mockData.activePlayers = mockData.activePlayers.filter(
                  ap => !(ap[column] === value && ap[column2] === value2)
                )
              }
              return Promise.resolve({ data: null, error: null })
            }
          })
        })
      })
    }
  }
})

describe('Integration Tests - Full User Flow', () => {
  let playersStore: ReturnType<typeof usePlayersStore>
  let groupsStore: ReturnType<typeof useGroupsStore>
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    playersStore = usePlayersStore()
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

    // Clear mock data
    mockData.players = []
    mockData.groups = []
    mockData.groupPlayers = []
    mockData.activePlayers = []
  })

  describe('Complete User Workflow', () => {
    it('should handle full player and group creation workflow', async () => {
      // Step 1: Create players
      const player1 = await playersStore.addPlayer('Alice')
      const player2 = await playersStore.addPlayer('Bob')
      const player3 = await playersStore.addPlayer('Charlie')

      expect(playersStore.players).toHaveLength(3)
      expect(player1.name).toBe('Alice')

      // Step 2: Create a group
      const group = await groupsStore.addGroup('Team Red', 'bg-red-500')

      expect(groupsStore.groups).toHaveLength(1)
      expect(group.name).toBe('Team Red')
      expect(group.playerIds).toHaveLength(0)

      // Step 3: Add players to group
      await groupsStore.addPlayerToGroup(group.id, player1.id)
      await groupsStore.addPlayerToGroup(group.id, player2.id)

      expect(groupsStore.groups[0].playerIds).toContain(player1.id)
      expect(groupsStore.groups[0].playerIds).toContain(player2.id)
      expect(groupsStore.groups[0].playerIds).toHaveLength(2)

      // Step 4: Set active players
      await groupsStore.setActivePlayer(player1.id, true)
      await groupsStore.setActivePlayer(player2.id, true)

      expect(groupsStore.activePlayerIds.has(player1.id)).toBe(true)
      expect(groupsStore.activePlayerIds.has(player2.id)).toBe(true)
      expect(groupsStore.getActivePlayers()).toHaveLength(2)

      // Step 5: Update player name
      await playersStore.updatePlayer(player1.id, 'Alice Smith')

      expect(playersStore.players[0].name).toBe('Alice Smith')

      // Step 6: Remove player from group
      await groupsStore.removePlayerFromGroup(group.id, player2.id)

      expect(groupsStore.groups[0].playerIds).not.toContain(player2.id)
      expect(groupsStore.groups[0].playerIds).toHaveLength(1)

      // Step 7: Delete a player
      await playersStore.deletePlayer(player3.id)

      expect(playersStore.players).toHaveLength(2)
      expect(playersStore.getPlayerById(player3.id)).toBeUndefined()
    })

    it('should handle multiple groups with shared players', async () => {
      // Create players
      const player1 = await playersStore.addPlayer('Player 1')
      const player2 = await playersStore.addPlayer('Player 2')

      // Create groups
      const group1 = await groupsStore.addGroup('Group A', 'bg-blue-500')
      const group2 = await groupsStore.addGroup('Group B', 'bg-green-500')

      // Add same player to multiple groups
      await groupsStore.addPlayerToGroup(group1.id, player1.id)
      await groupsStore.addPlayerToGroup(group2.id, player1.id)
      await groupsStore.addPlayerToGroup(group1.id, player2.id)

      // Verify relationships
      const player1Groups = groupsStore.getGroupsByPlayerId(player1.id)
      expect(player1Groups).toHaveLength(2)
      
      const player2Groups = groupsStore.getGroupsByPlayerId(player2.id)
      expect(player2Groups).toHaveLength(1)
    })

    it('should maintain data consistency after fetch', async () => {
      // Add initial data
      await playersStore.addPlayer('Test Player')
      await groupsStore.addGroup('Test Group', 'bg-blue-500')

      const initialPlayerCount = playersStore.players.length
      const initialGroupCount = groupsStore.groups.length

      // Fetch data (simulates page refresh)
      await playersStore.fetchPlayers()
      await groupsStore.fetchGroups()

      expect(playersStore.players).toHaveLength(initialPlayerCount)
      expect(groupsStore.groups).toHaveLength(initialGroupCount)
    })

    it('should handle clearing active players', async () => {
      const player1 = await playersStore.addPlayer('Player 1')
      const player2 = await playersStore.addPlayer('Player 2')

      await groupsStore.setActivePlayer(player1.id, true)
      await groupsStore.setActivePlayer(player2.id, true)

      expect(groupsStore.getActivePlayers()).toHaveLength(2)

      await groupsStore.clearActivePlayers()

      expect(groupsStore.getActivePlayers()).toHaveLength(0)
      expect(groupsStore.activePlayerIds.size).toBe(0)
    })

    it('should handle group updates', async () => {
      const group = await groupsStore.addGroup('Original Name', 'bg-blue-500')

      await groupsStore.updateGroup(group.id, 'Updated Name', 'bg-red-500')

      const updatedGroup = groupsStore.getGroupById(group.id)
      expect(updatedGroup?.name).toBe('Updated Name')
      expect(updatedGroup?.color).toBe('bg-red-500')
    })

    it('should handle player query operations', async () => {
      const player1 = await playersStore.addPlayer('Alice')
      const player2 = await playersStore.addPlayer('Bob')
      const player3 = await playersStore.addPlayer('Charlie')

      // Test getPlayerById
      const foundPlayer = playersStore.getPlayerById(player2.id)
      expect(foundPlayer?.name).toBe('Bob')

      // Test getPlayersByIds
      const selectedPlayers = playersStore.getPlayersByIds([player1.id, player3.id])
      expect(selectedPlayers).toHaveLength(2)
      expect(selectedPlayers.map(p => p.name)).toEqual(['Alice', 'Charlie'])
    })
  })

  describe('Error Handling', () => {
    it('should throw error when not authenticated', async () => {
      authStore.user = null

      await expect(playersStore.addPlayer('Player')).rejects.toThrow('Not authenticated')
      await expect(groupsStore.addGroup('Group', 'bg-blue-500')).rejects.toThrow('Not authenticated')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty player list', async () => {
      await playersStore.fetchPlayers()
      expect(playersStore.players).toEqual([])
    })

    it('should handle empty group list', async () => {
      await groupsStore.fetchGroups()
      expect(groupsStore.groups).toEqual([])
    })

    it('should not duplicate player in group', async () => {
      const player = await playersStore.addPlayer('Player')
      const group = await groupsStore.addGroup('Group', 'bg-blue-500')

      await groupsStore.addPlayerToGroup(group.id, player.id)
      await groupsStore.addPlayerToGroup(group.id, player.id)

      expect(groupsStore.groups[0].playerIds.filter(id => id === player.id)).toHaveLength(1)
    })

    it('should handle toggling active player multiple times', async () => {
      const player = await playersStore.addPlayer('Player')

      await groupsStore.toggleActivePlayer(player.id)
      expect(groupsStore.activePlayerIds.has(player.id)).toBe(true)

      await groupsStore.toggleActivePlayer(player.id)
      expect(groupsStore.activePlayerIds.has(player.id)).toBe(false)

      await groupsStore.toggleActivePlayer(player.id)
      expect(groupsStore.activePlayerIds.has(player.id)).toBe(true)
    })
  })
})
