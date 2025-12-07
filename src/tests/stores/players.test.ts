import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePlayersStore } from '@/stores/players'
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

describe('Players Store', () => {
  let playersStore: ReturnType<typeof usePlayersStore>
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    playersStore = usePlayersStore()
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

  describe('fetchPlayers', () => {
    it('should fetch players from Supabase', async () => {
      const mockPlayers = [
        { id: '1', user_id: 'test-user-id', name: 'Player 1', created_at: '2025-01-01T00:00:00Z' },
        { id: '2', user_id: 'test-user-id', name: 'Player 2', created_at: '2025-01-02T00:00:00Z' }
      ]

      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockPlayers, error: null })
      } as any)

      await playersStore.fetchPlayers()

      expect(playersStore.players).toHaveLength(2)
      expect(playersStore.players[0].name).toBe('Player 1')
      expect(playersStore.players[1].name).toBe('Player 2')
      expect(mockFrom).toHaveBeenCalledWith('players')
    })

    it('should handle errors when fetching players', async () => {
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

      await expect(playersStore.fetchPlayers()).rejects.toThrow()
    })

    it('should not fetch if user is not authenticated', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      mockFrom.mockClear()
      
      authStore.user = null

      await playersStore.fetchPlayers()

      expect(mockFrom).not.toHaveBeenCalled()
      expect(playersStore.players).toHaveLength(0)
    })
  })

  describe('addPlayer', () => {
    it('should add a new player to Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const player = await playersStore.addPlayer('New Player')

      expect(player.name).toBe('New Player')
      expect(player.id).toBeDefined()
      expect(playersStore.players).toHaveLength(1)
      expect(mockFrom).toHaveBeenCalledWith('players')
    })

    it('should throw error if not authenticated', async () => {
      authStore.user = null

      await expect(playersStore.addPlayer('Player')).rejects.toThrow('Not authenticated')
    })

    it('should handle database errors', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Insert failed' } 
        })
      } as any)

      await expect(playersStore.addPlayer('Player')).rejects.toThrow()
    })
  })

  describe('updatePlayer', () => {
    beforeEach(async () => {
      // Add a player first
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await playersStore.addPlayer('Test Player')
    })

    it('should update a player in Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      const playerId = playersStore.players[0].id
      await playersStore.updatePlayer(playerId, 'Updated Name')

      expect(playersStore.players[0].name).toBe('Updated Name')
    })

    it('should throw error if not authenticated', async () => {
      authStore.user = null

      await expect(playersStore.updatePlayer('id', 'Name')).rejects.toThrow('Not authenticated')
    })
  })

  describe('deletePlayer', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await playersStore.addPlayer('Test Player')
    })

    it('should delete a player from Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      const playerId = playersStore.players[0].id
      await playersStore.deletePlayer(playerId)

      expect(playersStore.players).toHaveLength(0)
    })

    it('should throw error if not authenticated', async () => {
      authStore.user = null

      await expect(playersStore.deletePlayer('id')).rejects.toThrow('Not authenticated')
    })
  })

  describe('getPlayerById', () => {
    beforeEach(async () => {
      playersStore.setPlayers([
        { id: '1', name: 'Player 1', createdAt: Date.now() },
        { id: '2', name: 'Player 2', createdAt: Date.now() }
      ])
    })

    it('should return player by id', () => {
      const player = playersStore.getPlayerById('1')
      expect(player).toBeDefined()
      expect(player?.name).toBe('Player 1')
    })

    it('should return undefined for non-existent id', () => {
      const player = playersStore.getPlayerById('999')
      expect(player).toBeUndefined()
    })
  })

  describe('getPlayersByIds', () => {
    beforeEach(() => {
      playersStore.setPlayers([
        { id: '1', name: 'Player 1', createdAt: Date.now() },
        { id: '2', name: 'Player 2', createdAt: Date.now() },
        { id: '3', name: 'Player 3', createdAt: Date.now() }
      ])
    })

    it('should return multiple players by ids', () => {
      const players = playersStore.getPlayersByIds(['1', '3'])
      expect(players).toHaveLength(2)
      expect(players.map(p => p.name)).toEqual(['Player 1', 'Player 3'])
    })

    it('should return empty array for non-existent ids', () => {
      const players = playersStore.getPlayersByIds(['999', '888'])
      expect(players).toHaveLength(0)
    })
  })
})
