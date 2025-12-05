<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupsStore } from '@/stores/groups'
import { usePlayersStore } from '@/stores/players'
import { useStorageStore } from '@/stores/storage'
import { useMatchGenerator } from '@/composables/useMatchGenerator'
import BaseButton from '@/components/BaseButton.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import PlayerCard from '@/components/PlayerCard.vue'
import GroupFormModal from '@/organisms/GroupFormModal.vue'
import PlayerFormModal from '@/organisms/PlayerFormModal.vue'
import MatchCard from '@/organisms/MatchCard.vue'
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusIcon, UserPlusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const groupsStore = useGroupsStore()
const playersStore = usePlayersStore()
const storageStore = useStorageStore()

const isEditModalOpen = ref(false)
const isAddPlayerModalOpen = ref(false)
const isNewPlayerModalOpen = ref(false)
const { matches, generateMatches: generate } = useMatchGenerator()

const groupId = computed(() => route.params.id as string)

const group = computed(() => {
  return groupsStore.getGroupById(groupId.value)
})

const groupPlayers = computed(() => {
  if (!group.value) return []
  return playersStore.getPlayersByIds(group.value.playerIds)
    .sort((a, b) => a.name.localeCompare(b.name))
})

const availablePlayers = computed(() => {
  if (!group.value) return []
  return playersStore.players.filter((p: any) => !group.value!.playerIds.includes(p.id))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const activeCount = computed(() => {
  return groupPlayers.value.filter((p: any) => groupsStore.activePlayerIds.has(p.id)).length
})

const activePlayersInGroup = computed(() => {
  return groupPlayers.value.filter((p: any) => groupsStore.activePlayerIds.has(p.id))
})

const canGenerateMatches = computed(() => {
  return activePlayersInGroup.value.length >= 4
})

function goBack() {
  router.push('/groups')
}

function openEditModal() {
  isEditModalOpen.value = true
}

function handleDelete() {
  if (confirm('Are you sure you want to delete this group?')) {
    groupsStore.deleteGroup(groupId.value)
    storageStore.saveData()
    router.push('/groups')
  }
}

function togglePlayerActive(playerId: string) {
  groupsStore.toggleActivePlayer(playerId)
  storageStore.saveData()
}

function removePlayerFromGroup(playerId: string) {
  if (confirm('Remove this player from the group?')) {
    groupsStore.removePlayerFromGroup(groupId.value, playerId)
    groupsStore.setActivePlayer(playerId, false)
    storageStore.saveData()
  }
}

function addPlayerToGroup(playerId: string) {
  groupsStore.addPlayerToGroup(groupId.value, playerId)
  storageStore.saveData()
  // Keep modal open after adding player
}

function handleSaved() {
  storageStore.saveData()
}

function handlePlayerCreated() {
  // Get the most recently added player (the one just created)
  const players = playersStore.players
  if (players.length > 0) {
    const newPlayer = players[players.length - 1]
    // Add the new player to the current group
    groupsStore.addPlayerToGroup(groupId.value, newPlayer.id)
    // Make the new player active
    groupsStore.setActivePlayer(newPlayer.id, true)
  }
  storageStore.saveData()
}

function handleGenerateMatches() {
  generate(activePlayersInGroup.value)
}

onMounted(() => {
  if (!group.value) {
    router.push('/groups')
  }
})
</script>

<template>
  <div v-if="group" class="min-h-screen bg-stone-50 pb-8">
      <!-- Header -->
      <header class="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
        <div class="flex items-center gap-3 mb-4">
          <button
            class="p-1 text-stone-600 hover:text-stone-900 transition-colors"
            @click="goBack"
          >
            <ArrowLeftIcon class="w-6 h-6" />
          </button>
          <div :class="['w-4 h-4 rounded-full', group.color]" />
          <h1 class="text-2xl font-bold text-stone-900 flex-1">{{ group.name }}</h1>
        </div>
      </header>
    <div class="max-w-lg mx-auto">

      <div class="p-4 space-y-4">
        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-4 border border-stone-200 shadow-sm">
            <p class="text-sm text-stone-600 mb-1">Total Players</p>
            <p class="text-2xl font-bold text-stone-900">{{ groupPlayers.length }}</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-stone-200 shadow-sm">
            <p class="text-sm text-stone-600 mb-1">Active</p>
            <p class="text-2xl font-bold text-emerald-600">{{ activeCount }}</p>
          </div>
        </div>

        <!-- Generate Matches Button -->
        <BaseButton
          variant="primary"
          size="lg"
          full-width
          :disabled="!canGenerateMatches"
          @click="handleGenerateMatches"
        >
          <ArrowPathIcon class="w-5 h-5" />
          Generate Matches
        </BaseButton>

        <!-- Matches -->
        <div v-if="matches.length > 0" class="space-y-5">
          <h2 class="text-lg font-semibold text-stone-900 mb-1">Generated Matches</h2>
          <MatchCard
            v-for="(match, index) in matches"
            :key="match.id"
            :match="match"
            :players="playersStore.players"
            :match-number="index + 1"
          />
        </div>

        <!-- Players in Group -->
        <div v-if="groupPlayers.length > 0">
          <h2 class="text-lg font-semibold text-stone-900 mb-4">Players</h2>
          <div class="space-y-2">
            <PlayerCard
              v-for="player in groupPlayers"
              :key="player.id"
              :player="player"
              :is-active="groupsStore.activePlayerIds.has(player.id)"
              :show-actions="true"
              @toggle="togglePlayerActive(player.id)"
              @delete="removePlayerFromGroup(player.id)"
            >
              <template #edit-icon>
                <div />
              </template>
              <template #delete-icon>
                <TrashIcon class="w-5 h-5" />
              </template>
            </PlayerCard>
          </div>
          
          
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-stone-500">No players in this group yet</p>
        </div>

          <div class="mt-4 flex flex-row gap-4">
          <!-- Create New Player Button -->
            <BaseButton
              variant="secondary"
              full-width
              @click="isNewPlayerModalOpen = true"
            >
              <PlusIcon class="w-5 h-5" />
              Create Player
            </BaseButton>
            <!-- Add Player Button -->
            <BaseButton
            v-if="availablePlayers.length > 0"
            variant="primary"
            full-width
            @click="isAddPlayerModalOpen = true"
            >
            <UserPlusIcon class="w-5 h-5" />
            Add Player
            </BaseButton>
          </div>
        <BaseDivider />
        
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm" @click="openEditModal">
            <PencilIcon class="w-4 h-4" />
            Edit
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="handleDelete">
            <TrashIcon class="w-4 h-4" />
            Delete
          </BaseButton>
        </div>
      </div>
    </div>

    <GroupFormModal
      :is-open="isEditModalOpen"
      :edit-group-id="groupId"
      @close="isEditModalOpen = false"
      @saved="handleSaved"
    />

    <PlayerFormModal
      :is-open="isNewPlayerModalOpen"
      @close="isNewPlayerModalOpen = false"
      @saved="handlePlayerCreated"
    />

    <!-- Add Player Modal -->
    <div
      v-if="isAddPlayerModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="isAddPlayerModalOpen = false"
    >
      <div class="w-full h-full max-w-lg bg-white shadow-xl overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 class="text-lg font-semibold text-stone-900">Add Player</h2>
          <button
            class="p-1 text-stone-500 hover:text-stone-700 transition-colors"
            @click="isAddPlayerModalOpen = false"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1 space-y-2">
          <button
            v-for="player in availablePlayers"
            :key="player.id"
            class="w-full p-4 text-left rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm"
            @click="addPlayerToGroup(player.id)"
          >
            <p class="font-medium text-stone-900">{{ player.name }}</p>
          </button>
          <p v-if="availablePlayers.length === 0" class="text-center text-stone-500 py-8">
            All players are already in this group
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
