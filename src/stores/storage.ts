import { defineStore } from 'pinia'
import type { AppData } from '@/types'
import { usePlayersStore } from './players'
import { useGroupsStore } from './groups'

const STORAGE_KEY = 'matchmaker_data'

export const useStorageStore = defineStore('storage', () => {
  function saveData(): void {
    const playersStore = usePlayersStore()
    const groupsStore = useGroupsStore()

    const data: AppData = {
      players: playersStore.players,
      groups: groupsStore.groups,
      activePlayerIds: groupsStore.getActivePlayers()
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }

  async function loadData(): Promise<void> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      
      if (stored) {
        // Data exists in local storage, load it
        const data: AppData = JSON.parse(stored)
        const playersStore = usePlayersStore()
        const groupsStore = useGroupsStore()

        playersStore.setPlayers(data.players || [])
        groupsStore.setGroups(data.groups || [])
        groupsStore.setActivePlayerIds(data.activePlayerIds || [])
      } else {
        // No data in local storage, load default data from JSON file
        const response = await fetch('/matchmaker-data-2025-12-05.json')
        if (response.ok) {
          const data: AppData = await response.json()
          const playersStore = usePlayersStore()
          const groupsStore = useGroupsStore()

          playersStore.setPlayers(data.players || [])
          groupsStore.setGroups(data.groups || [])
          groupsStore.setActivePlayerIds(data.activePlayerIds || [])
          
          // Save the default data to local storage
          saveData()
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  function clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }

  return {
    saveData,
    loadData,
    clearData
  }
})
