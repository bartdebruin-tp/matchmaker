import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSubPagesStore } from '@/stores/subPages'
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
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}))

describe('SubPages Store', () => {
  let subPagesStore: ReturnType<typeof useSubPagesStore>
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    subPagesStore = useSubPagesStore()
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

  describe('fetchSubPages', () => {
    it('should fetch sub-pages and their relationships from Supabase', async () => {
      const mockSubPages = [
        { id: 'sp1', group_id: 'g1', name: 'Session 1', date: '2025-01-01T00:00:00Z', created_at: '2025-01-01T00:00:00Z' },
        { id: 'sp2', group_id: 'g1', name: 'Session 2', date: '2025-01-02T00:00:00Z', created_at: '2025-01-02T00:00:00Z' }
      ]

      const mockSubPagePlayers = [
        { sub_page_id: 'sp1', player_id: 'p1' },
        { sub_page_id: 'sp1', player_id: 'p2' },
        { sub_page_id: 'sp2', player_id: 'p3' }
      ]

      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockImplementation((table: string) => {
        if (table === 'sub_pages') {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockSubPages, error: null })
          } as any
        } else if (table === 'sub_page_players') {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockResolvedValue({ data: mockSubPagePlayers, error: null })
          } as any
        }
        return {} as any
      })

      await subPagesStore.fetchSubPages('g1')

      expect(subPagesStore.subPages).toHaveLength(2)
      expect(subPagesStore.subPages[0].presentPlayerIds).toEqual(['p1', 'p2'])
      expect(subPagesStore.subPages[1].presentPlayerIds).toEqual(['p3'])
    })

    it('should handle errors when fetching sub-pages', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database error' } 
        })
      } as any)

      await expect(subPagesStore.fetchSubPages()).rejects.toThrow()
    })
  })

  describe('addSubPage', () => {
    it('should add a new sub-page to Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const subPage = await subPagesStore.addSubPage('g1', 'Session 1', Date.now())

      expect(subPage.name).toBe('Session 1')
      expect(subPage.groupId).toBe('g1')
      expect(subPage.presentPlayerIds).toEqual([])
      expect(subPagesStore.subPages).toHaveLength(1)
    })

    it('should throw error if not authenticated', async () => {
      authStore.user = null

      await expect(subPagesStore.addSubPage('g1', 'Session', Date.now())).rejects.toThrow('Not authenticated')
    })
  })

  describe('updateSubPage', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await subPagesStore.addSubPage('g1', 'Test Session', Date.now())
    })

    it('should update a sub-page in Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      } as any)

      const subPageId = subPagesStore.subPages[0].id
      const newDate = Date.now() + 86400000 // +1 day
      await subPagesStore.updateSubPage(subPageId, 'Updated Session', newDate)

      expect(subPagesStore.subPages[0].name).toBe('Updated Session')
      expect(subPagesStore.subPages[0].date).toBe(newDate)
    })
  })

  describe('deleteSubPage', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await subPagesStore.addSubPage('g1', 'Test Session', Date.now())
    })

    it('should delete a sub-page from Supabase', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      } as any)

      const subPageId = subPagesStore.subPages[0].id
      await subPagesStore.deleteSubPage(subPageId)

      expect(subPagesStore.subPages).toHaveLength(0)
    })
  })

  describe('addPlayerToSubPage', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await subPagesStore.addSubPage('g1', 'Test Session', Date.now())
    })

    it('should add a player to a sub-page', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const subPageId = subPagesStore.subPages[0].id
      await subPagesStore.addPlayerToSubPage(subPageId, 'player1')

      expect(subPagesStore.subPages[0].presentPlayerIds).toContain('player1')
    })

    it('should not add duplicate player to sub-page', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const subPageId = subPagesStore.subPages[0].id
      await subPagesStore.addPlayerToSubPage(subPageId, 'player1')
      
      // Try to add same player again
      await subPagesStore.addPlayerToSubPage(subPageId, 'player1')

      expect(subPagesStore.subPages[0].presentPlayerIds.filter(id => id === 'player1')).toHaveLength(1)
    })
  })

  describe('removePlayerFromSubPage', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await subPagesStore.addSubPage('g1', 'Test Session', Date.now())
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)
      
      await subPagesStore.addPlayerToSubPage(subPagesStore.subPages[0].id, 'player1')
    })

    it('should remove a player from a sub-page', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      const subPageId = subPagesStore.subPages[0].id
      await subPagesStore.removePlayerFromSubPage(subPageId, 'player1')

      expect(subPagesStore.subPages[0].presentPlayerIds).not.toContain('player1')
    })
  })

  describe('togglePlayerPresent', () => {
    beforeEach(async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      await subPagesStore.addSubPage('g1', 'Test Session', Date.now())
    })

    it('should toggle player present status', async () => {
      const { supabase } = await import('@/lib/supabase')
      const mockFrom = vi.mocked(supabase.from)
      
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any)

      const subPageId = subPagesStore.subPages[0].id
      await subPagesStore.togglePlayerPresent(subPageId, 'player1')
      expect(subPagesStore.subPages[0].presentPlayerIds).toContain('player1')

      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      } as any)

      await subPagesStore.togglePlayerPresent(subPageId, 'player1')
      expect(subPagesStore.subPages[0].presentPlayerIds).not.toContain('player1')
    })
  })

  describe('getSubPageById', () => {
    beforeEach(() => {
      subPagesStore.setSubPages([
        { id: 'sp1', groupId: 'g1', name: 'Session 1', presentPlayerIds: [], createdAt: Date.now() },
        { id: 'sp2', groupId: 'g1', name: 'Session 2', presentPlayerIds: [], createdAt: Date.now() }
      ])
    })

    it('should return sub-page by id', () => {
      const subPage = subPagesStore.getSubPageById('sp1')
      expect(subPage).toBeDefined()
      expect(subPage?.name).toBe('Session 1')
    })

    it('should return undefined for non-existent id', () => {
      const subPage = subPagesStore.getSubPageById('sp999')
      expect(subPage).toBeUndefined()
    })
  })

  describe('getSubPagesByGroupId', () => {
    beforeEach(() => {
      subPagesStore.setSubPages([
        { id: 'sp1', groupId: 'g1', name: 'Session 1', presentPlayerIds: [], createdAt: Date.now() - 2000 },
        { id: 'sp2', groupId: 'g1', name: 'Session 2', presentPlayerIds: [], createdAt: Date.now() - 1000 },
        { id: 'sp3', groupId: 'g2', name: 'Session 3', presentPlayerIds: [], createdAt: Date.now() }
      ])
    })

    it('should return sub-pages for a specific group', () => {
      const subPages = subPagesStore.getSubPagesByGroupId('g1')
      expect(subPages).toHaveLength(2)
      expect(subPages.map(sp => sp.name)).toEqual(['Session 2', 'Session 1']) // Sorted by createdAt desc
    })

    it('should return empty array if group has no sub-pages', () => {
      const subPages = subPagesStore.getSubPagesByGroupId('g999')
      expect(subPages).toHaveLength(0)
    })
  })
})
