import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Group } from '@/types'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref<Group[]>([])
  const activePlayerIds = ref<Set<string>>(new Set())

  function getGroupById(id: string): Group | undefined {
    return groups.value.find(g => g.id === id)
  }

  function getGroupsByPlayerId(playerId: string): Group[] {
    return groups.value.filter(g => g.playerIds.includes(playerId))
  }

  function getActivePlayers(): string[] {
    return Array.from(activePlayerIds.value)
  }

  function addGroup(name: string, color: string): Group {
    const group: Group = {
      id: crypto.randomUUID(),
      name,
      color,
      playerIds: [],
      createdAt: Date.now()
    }
    groups.value.push(group)
    return group
  }

  function updateGroup(id: string, name: string, color: string): void {
    const group = groups.value.find(g => g.id === id)
    if (group) {
      group.name = name
      group.color = color
    }
  }

  function deleteGroup(id: string): void {
    const index = groups.value.findIndex(g => g.id === id)
    if (index !== -1) {
      groups.value.splice(index, 1)
    }
  }

  function addPlayerToGroup(groupId: string, playerId: string): void {
    const group = groups.value.find(g => g.id === groupId)
    if (group && !group.playerIds.includes(playerId)) {
      group.playerIds.push(playerId)
    }
  }

  function removePlayerFromGroup(groupId: string, playerId: string): void {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      const index = group.playerIds.indexOf(playerId)
      if (index !== -1) {
        group.playerIds.splice(index, 1)
      }
    }
  }

  function toggleActivePlayer(playerId: string): void {
    if (activePlayerIds.value.has(playerId)) {
      activePlayerIds.value.delete(playerId)
    } else {
      activePlayerIds.value.add(playerId)
    }
  }

  function setActivePlayer(playerId: string, active: boolean): void {
    if (active) {
      activePlayerIds.value.add(playerId)
    } else {
      activePlayerIds.value.delete(playerId)
    }
  }

  function clearActivePlayers(): void {
    activePlayerIds.value.clear()
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
    getActivePlayers,
    getGroupById,
    getGroupsByPlayerId,
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
