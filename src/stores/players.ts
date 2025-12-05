import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Player } from '@/types'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([])

  function getPlayerById(id: string): Player | undefined {
    return players.value.find(p => p.id === id)
  }

  function getPlayersByIds(ids: string[]): Player[] {
    return players.value.filter(p => ids.includes(p.id))
  }

  function addPlayer(name: string): Player {
    const player: Player = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now()
    }
    players.value.push(player)
    return player
  }

  function updatePlayer(id: string, name: string): void {
    const player = players.value.find(p => p.id === id)
    if (player) {
      player.name = name
    }
  }

  function deletePlayer(id: string): void {
    const index = players.value.findIndex(p => p.id === id)
    if (index !== -1) {
      players.value.splice(index, 1)
    }
  }

  function setPlayers(newPlayers: Player[]): void {
    players.value = newPlayers
  }

  return {
    players,
    getPlayerById,
    getPlayersByIds,
    addPlayer,
    updatePlayer,
    deletePlayer,
    setPlayers
  }
})
