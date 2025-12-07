import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Group } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref<Group[]>([])
  const activePlayerIds = ref<Set<string>>(new Set())
  const loading = ref(false)

  function getGroupById(id: string): Group | undefined {
    return groups.value.find(g => g.id === id)
  }

  function getGroupsByPlayerId(playerId: string): Group[] {
    return groups.value.filter(g => g.playerIds.includes(playerId))
  }

  function getActivePlayers(): string[] {
    return Array.from(activePlayerIds.value)
  }

  async function fetchGroups(): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    try {
      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: true })

      if (groupsError) throw groupsError

      // Fetch group-player relationships
      const { data: groupPlayersData, error: groupPlayersError } = await supabase
        .from('group_players')
        .select('group_id, player_id')

      if (groupPlayersError) throw groupPlayersError

      // Build groups with player IDs
      groups.value = (groupsData || []).map(g => {
        const playerIds = (groupPlayersData || [])
          .filter(gp => gp.group_id === g.id)
          .map(gp => gp.player_id)

        return {
          id: g.id,
          name: g.name,
          color: g.color,
          playerIds,
          createdAt: new Date(g.created_at).getTime()
        }
      })

      // Fetch active players
      const { data: activePlayersData, error: activePlayersError } = await supabase
        .from('active_players')
        .select('player_id')
        .eq('user_id', authStore.user.id)

      if (activePlayersError) throw activePlayersError

      activePlayerIds.value = new Set((activePlayersData || []).map(ap => ap.player_id))
    } catch (error) {
      console.error('Error fetching groups:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addGroup(name: string, color: string): Promise<Group> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    const group: Group = {
      id: crypto.randomUUID(),
      name,
      color,
      playerIds: [],
      createdAt: Date.now()
    }

    try {
      const { error } = await supabase
        .from('groups')
        .insert({
          id: group.id,
          user_id: authStore.user.id,
          name: group.name,
          color: group.color,
          created_at: new Date(group.createdAt).toISOString()
        })

      if (error) throw error

      groups.value.push(group)
      return group
    } catch (error) {
      console.error('Error adding group:', error)
      throw error
    }
  }

  async function updateGroup(id: string, name: string, color: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await supabase
        .from('groups')
        .update({ name, color })
        .eq('id', id)
        .eq('user_id', authStore.user.id)

      if (error) throw error

      const group = groups.value.find(g => g.id === id)
      if (group) {
        group.name = name
        group.color = color
      }
    } catch (error) {
      console.error('Error updating group:', error)
      throw error
    }
  }

  async function deleteGroup(id: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id)
        .eq('user_id', authStore.user.id)

      if (error) throw error

      const index = groups.value.findIndex(g => g.id === id)
      if (index !== -1) {
        groups.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error deleting group:', error)
      throw error
    }
  }

  async function addPlayerToGroup(groupId: string, playerId: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    const group = groups.value.find(g => g.id === groupId)
    if (group && group.playerIds.includes(playerId)) return

    try {
      const { error } = await supabase
        .from('group_players')
        .insert({
          id: crypto.randomUUID(),
          group_id: groupId,
          player_id: playerId
        })

      if (error) throw error

      if (group) {
        group.playerIds.push(playerId)
      }
    } catch (error) {
      console.error('Error adding player to group:', error)
      throw error
    }
  }

  async function removePlayerFromGroup(groupId: string, playerId: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await supabase
        .from('group_players')
        .delete()
        .eq('group_id', groupId)
        .eq('player_id', playerId)

      if (error) throw error

      const group = groups.value.find(g => g.id === groupId)
      if (group) {
        const index = group.playerIds.indexOf(playerId)
        if (index !== -1) {
          group.playerIds.splice(index, 1)
        }
      }
    } catch (error) {
      console.error('Error removing player from group:', error)
      throw error
    }
  }

  async function toggleActivePlayer(playerId: string): Promise<void> {
    const isActive = activePlayerIds.value.has(playerId)
    await setActivePlayer(playerId, !isActive)
  }

  async function setActivePlayer(playerId: string, active: boolean): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      if (active) {
        const { error } = await supabase
          .from('active_players')
          .insert({
            id: crypto.randomUUID(),
            user_id: authStore.user.id,
            player_id: playerId
          })

        if (error) throw error
        activePlayerIds.value.add(playerId)
      } else {
        const { error } = await supabase
          .from('active_players')
          .delete()
          .eq('user_id', authStore.user.id)
          .eq('player_id', playerId)

        if (error) throw error
        activePlayerIds.value.delete(playerId)
      }
    } catch (error) {
      console.error('Error setting active player:', error)
      throw error
    }
  }

  async function clearActivePlayers(): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await supabase
        .from('active_players')
        .delete()
        .eq('user_id', authStore.user.id)

      if (error) throw error
      activePlayerIds.value.clear()
    } catch (error) {
      console.error('Error clearing active players:', error)
      throw error
    }
  }

  function setGroups(newGroups: Group[]): void {
    groups.value = newGroups
  }

  function setActivePlayerIds(playerIds: string[]): void {
    activePlayerIds.value = new Set(playerIds)
  }

  return {
    groups,
    activePlayerIds,
    loading,
    getActivePlayers,
    getGroupById,
    getGroupsByPlayerId,
    fetchGroups,
    addGroup,
    updateGroup,
    deleteGroup,
    addPlayerToGroup,
    removePlayerFromGroup,
    toggleActivePlayer,
    setActivePlayer,
    clearActivePlayers,
    setGroups,
    setActivePlayerIds
  }
})
