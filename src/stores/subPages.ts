import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SubPage } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const useSubPagesStore = defineStore('subPages', () => {
  const subPages = ref<SubPage[]>([])
  const loading = ref(false)

  function getSubPageById(id: string): SubPage | undefined {
    return subPages.value.find(sp => sp.id === id)
  }

  function getSubPagesByGroupId(groupId: string): SubPage[] {
    return subPages.value.filter(sp => sp.groupId === groupId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  async function fetchSubPages(groupId?: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    try {
      // Build query
      let query = supabase
        .from('sub_pages')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch sub-pages
      const { data: subPagesData, error: subPagesError } = await query

      if (subPagesError) throw subPagesError

      // Filter by group if groupId is provided, otherwise fetch all
      const filteredSubPages = groupId 
        ? (subPagesData || []).filter((sp: any) => sp.group_id === groupId)
        : (subPagesData || [])

      // Get sub-page IDs
      const subPageIds = filteredSubPages.map((sp: any) => sp.id)

      // Fetch sub-page-player relationships
      let playersQuery = supabase
        .from('sub_page_players')
        .select('sub_page_id, player_id')

      if (subPageIds.length > 0) {
        playersQuery = playersQuery.in('sub_page_id', subPageIds)
      }

      const { data: subPagePlayersData, error: subPagePlayersError } = await playersQuery

      if (subPagePlayersError) throw subPagePlayersError

      // Build sub-pages with player IDs
      const mappedSubPages = filteredSubPages.map((sp: any) => {
        const presentPlayerIds = (subPagePlayersData || [])
          .filter((spp: any) => spp.sub_page_id === sp.id)
          .map((spp: any) => spp.player_id)

        return {
          id: sp.id,
          groupId: sp.group_id,
          name: sp.name,
          date: sp.date ? new Date(sp.date).getTime() : undefined,
          presentPlayerIds,
          createdAt: new Date(sp.created_at).getTime()
        }
      })

      if (groupId) {
        // Update only sub-pages for this group
        subPages.value = [
          ...subPages.value.filter(sp => sp.groupId !== groupId),
          ...mappedSubPages
        ]
      } else {
        // Replace all sub-pages
        subPages.value = mappedSubPages
      }
    } catch (error) {
      console.error('Error fetching sub-pages:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addSubPage(groupId: string, name: string, date?: number): Promise<SubPage> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    const subPage: SubPage = {
      id: crypto.randomUUID(),
      groupId,
      name,
      date,
      presentPlayerIds: [],
      createdAt: Date.now()
    }

    try {
      const { error } = await supabase
        .from('sub_pages')
        .insert({
          id: subPage.id,
          group_id: subPage.groupId,
          name: subPage.name,
          date: subPage.date ? new Date(subPage.date).toISOString() : null,
          created_at: new Date(subPage.createdAt).toISOString()
        } as any)

      if (error) throw error

      subPages.value.push(subPage)
      return subPage
    } catch (error) {
      console.error('Error adding sub-page:', error)
      throw error
    }
  }

  async function updateSubPage(id: string, name: string, date?: number): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await (supabase
        .from('sub_pages') as any)
        .update({ 
          name, 
          date: date ? new Date(date).toISOString() : null 
        })
        .eq('id', id)

      if (error) throw error

      const subPage = subPages.value.find(sp => sp.id === id)
      if (subPage) {
        subPage.name = name
        subPage.date = date
      }
    } catch (error) {
      console.error('Error updating sub-page:', error)
      throw error
    }
  }

  async function deleteSubPage(id: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await supabase
        .from('sub_pages')
        .delete()
        .eq('id', id)

      if (error) throw error

      const index = subPages.value.findIndex(sp => sp.id === id)
      if (index !== -1) {
        subPages.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error deleting sub-page:', error)
      throw error
    }
  }

  async function addPlayerToSubPage(subPageId: string, playerId: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    const subPage = subPages.value.find(sp => sp.id === subPageId)
    if (subPage && subPage.presentPlayerIds.includes(playerId)) return

    try {
      const { error } = await supabase
        .from('sub_page_players')
        .insert({
          id: crypto.randomUUID(),
          sub_page_id: subPageId,
          player_id: playerId
        } as any)

      if (error) throw error

      if (subPage) {
        subPage.presentPlayerIds.push(playerId)
      }
    } catch (error) {
      console.error('Error adding player to sub-page:', error)
      throw error
    }
  }

  async function removePlayerFromSubPage(subPageId: string, playerId: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await supabase
        .from('sub_page_players')
        .delete()
        .eq('sub_page_id', subPageId)
        .eq('player_id', playerId)

      if (error) throw error

      const subPage = subPages.value.find(sp => sp.id === subPageId)
      if (subPage) {
        const index = subPage.presentPlayerIds.indexOf(playerId)
        if (index !== -1) {
          subPage.presentPlayerIds.splice(index, 1)
        }
      }
    } catch (error) {
      console.error('Error removing player from sub-page:', error)
      throw error
    }
  }

  async function togglePlayerPresent(subPageId: string, playerId: string): Promise<void> {
    const subPage = subPages.value.find(sp => sp.id === subPageId)
    if (!subPage) throw new Error('Sub-page not found')

    const isPresent = subPage.presentPlayerIds.includes(playerId)
    if (isPresent) {
      await removePlayerFromSubPage(subPageId, playerId)
    } else {
      await addPlayerToSubPage(subPageId, playerId)
    }
  }

  function setSubPages(newSubPages: SubPage[]): void {
    subPages.value = newSubPages
  }

  return {
    subPages,
    loading,
    getSubPageById,
    getSubPagesByGroupId,
    fetchSubPages,
    addSubPage,
    updateSubPage,
    deleteSubPage,
    addPlayerToSubPage,
    removePlayerFromSubPage,
    togglePlayerPresent,
    setSubPages
  }
})
