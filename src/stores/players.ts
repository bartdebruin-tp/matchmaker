import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Player } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([])
  const loading = ref(false)

  function getPlayerById(id: string): Player | undefined {
    return players.value.find(p => p.id === id)
  }

  function getPlayersByIds(ids: string[]): Player[] {
    return players.value.filter(p => ids.includes(p.id))
  }

  async function fetchPlayers(): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      players.value = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        createdAt: new Date(p.created_at).getTime()
      }))
    } catch (error) {
      console.error('Error fetching players:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addPlayer(name: string): Promise<Player> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    const player: Player = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now()
    }

    try {
      const { error } = await supabase
        .from('players')
        .insert({
          id: player.id,
          user_id: authStore.user.id,
          name: player.name,
          created_at: new Date(player.createdAt).toISOString()
        } as any)

      if (error) throw error

      players.value.push(player)
      return player
    } catch (error) {
      console.error('Error adding player:', error)
      throw error
    }
  }

  async function updatePlayer(id: string, name: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await (supabase
        .from('players') as any)
        .update({ name })
        .eq('id', id)
        .eq('user_id', authStore.user.id)

      if (error) throw error

      const player = players.value.find(p => p.id === id)
      if (player) {
        player.name = name
      }
    } catch (error) {
      console.error('Error updating player:', error)
      throw error
    }
  }

  async function deletePlayer(id: string): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) throw new Error('Not authenticated')

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id)
        .eq('user_id', authStore.user.id)

      if (error) throw error

      const index = players.value.findIndex(p => p.id === id)
      if (index !== -1) {
        players.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error deleting player:', error)
      throw error
    }
  }

  function setPlayers(newPlayers: Player[]): void {
    players.value = newPlayers
  }

  return {
    players,
    loading,
    getPlayerById,
    getPlayersByIds,
    fetchPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
    setPlayers
  }
})
