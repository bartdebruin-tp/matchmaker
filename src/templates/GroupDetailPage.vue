<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useGroupsStore } from '@/stores/groups'
import { usePlayersStore } from '@/stores/players'
import { useSubPagesStore } from '@/stores/subPages'
import { useStorageStore } from '@/stores/storage'
import { useToast } from '@/composables/useToast'
import { useMatchGenerator } from '@/composables/useMatchGenerator'
import BaseButton from '@/components/BaseButton.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import PlayerCard from '@/components/PlayerCard.vue'
import GroupFormModal from '@/organisms/GroupFormModal.vue'
import PlayerFormModal from '@/organisms/PlayerFormModal.vue'
import MatchCard from '@/organisms/MatchCard.vue'
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusIcon, UserPlusIcon, ArrowPathIcon, CalendarIcon, CheckIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const groupsStore = useGroupsStore()
const playersStore = usePlayersStore()
const subPagesStore = useSubPagesStore()
const storageStore = useStorageStore()
const toast = useToast()

const isEditModalOpen = ref(false)
const isAddPlayerModalOpen = ref(false)
const isNewPlayerModalOpen = ref(false)
const isCreateSubPageModalOpen = ref(false)
const selectedSubPageId = ref<string | null>(null)
const newSubPageName = ref('')
const loading = ref(true)
const { matches, generateMatches: generate } = useMatchGenerator()

onMounted(async () => {
  try {
    await Promise.all([
      playersStore.fetchPlayers(),
      groupsStore.fetchGroups()
    ])
    if (group.value?.matchType === 'scheduled') {
      await subPagesStore.fetchSubPages(groupId.value)
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})

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

const isScheduledGroup = computed(() => {
  return group.value?.matchType === 'scheduled'
})

const subPages = computed(() => {
  if (!group.value) return []
  return subPagesStore.getSubPagesByGroupId(group.value.id)
})

const selectedSubPage = computed(() => {
  if (!selectedSubPageId.value) return null
  return subPagesStore.getSubPageById(selectedSubPageId.value)
})

function goBack() {
  router.push('/groups')
}

function openEditModal() {
  isEditModalOpen.value = true
}

async function handleDelete() {
  if (confirm(t.value.groups.deleteMessage)) {
    try {
      await groupsStore.deleteGroup(groupId.value)
      storageStore.saveData()
      toast.success(t.value.groups.groupDeleted)
      router.push('/groups')
    } catch (error) {
      console.error('Error deleting group:', error)
      toast.error(t.value.errors.deleteFailed)
    }
  }
}

async function togglePlayerActive(playerId: string) {
  try {
    await groupsStore.toggleActivePlayer(playerId)
    storageStore.saveData()
  } catch (error) {
    console.error('Error toggling player active:', error)
  }
}

async function removePlayerFromGroup(playerId: string) {
  if (confirm(t.value.players.deleteMessage)) {
    try {
      await groupsStore.removePlayerFromGroup(groupId.value, playerId)
      await groupsStore.setActivePlayer(playerId, false)
      storageStore.saveData()
      toast.success(t.value.players.playerDeleted)
    } catch (error) {
      console.error('Error removing player:', error)
      toast.error(t.value.errors.deleteFailed)
    }
  }
}

async function addPlayerToGroup(playerId: string) {
  try {
    await groupsStore.addPlayerToGroup(groupId.value, playerId)
    storageStore.saveData()
    toast.success(t.value.players.playerAdded)
    // Keep modal open after adding player
  } catch (error) {
    console.error('Error adding player:', error)
    toast.error(t.value.errors.saveFailed)
  }
}

function handleSaved() {
  storageStore.saveData()
}

async function handlePlayerCreated() {
  // Get the most recently added player (the one just created)
  const players = playersStore.players
  if (players.length > 0) {
    const newPlayer = players[players.length - 1]
    try {
      // Add the new player to the current group
      await groupsStore.addPlayerToGroup(groupId.value, newPlayer.id)
      // Make the new player active
      await groupsStore.setActivePlayer(newPlayer.id, true)
      storageStore.saveData()
    } catch (error) {
      console.error('Error adding new player to group:', error)
    }
  }
}

function handleGenerateMatches() {
  generate(activePlayersInGroup.value)
}

async function createSubPage() {
  if (!newSubPageName.value.trim()) {
    toast.error(t.value.errors.requiredField)
    return
  }

  try {
    await subPagesStore.addSubPage(groupId.value, newSubPageName.value.trim())
    storageStore.saveData()
    toast.success(t.value.groupDetail.subPageAdded)
    newSubPageName.value = ''
    isCreateSubPageModalOpen.value = false
  } catch (error) {
    console.error('Error creating sub-page:', error)
    toast.error(t.value.errors.saveFailed)
  }
}

function openSubPage(subPageId: string) {
  selectedSubPageId.value = subPageId
}

function closeSubPage() {
  selectedSubPageId.value = null
}

async function togglePlayerPresence(playerId: string) {
  if (!selectedSubPageId.value) return

  try {
    await subPagesStore.togglePlayerPresent(selectedSubPageId.value, playerId)
    storageStore.saveData()
  } catch (error) {
    console.error('Error toggling player presence:', error)
    toast.error(t.value.errors.saveFailed)
  }
}

async function deleteSubPage(subPageId: string) {
  if (confirm(t.value.groupDetail.deleteSubPage + '?')) {
    try {
      await subPagesStore.deleteSubPage(subPageId)
      storageStore.saveData()
      toast.success(t.value.groupDetail.subPageDeleted)
      if (selectedSubPageId.value === subPageId) {
        selectedSubPageId.value = null
      }
    } catch (error) {
      console.error('Error deleting sub-page:', error)
      toast.error(t.value.errors.deleteFailed)
    }
  }
}

function formatDate(timestamp?: number): string {
  if (!timestamp) return t.value.groupDetail.selectDate
  return new Date(timestamp).toLocaleDateString()
}

onMounted(() => {
  if (!group.value) {
    router.push('/groups')
  }
})
</script>

<template>
  <div v-if="group" class="min-h-screen bg-amber-50 pb-8">
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
            <p class="text-sm text-stone-600 mb-1">{{ t.players.totalPlayers }}</p>
            <p class="text-2xl font-bold text-stone-900">{{ groupPlayers.length }}</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-stone-200 shadow-sm">
            <p class="text-sm text-stone-600 mb-1">{{ t.players.active }}</p>
            <p class="text-2xl font-bold text-green-600">{{ activeCount }}</p>
          </div>
        </div>

        <!-- Random Matches Mode -->
        <div v-if="!isScheduledGroup">
          <!-- Generate Matches Button -->
          <BaseButton
            variant="primary"
            size="lg"
            full-width
            :disabled="!canGenerateMatches"
            @click="handleGenerateMatches"
          >
            <ArrowPathIcon class="w-5 h-5" />
            {{ t.groupDetail.generateMatches }}
          </BaseButton>

          <!-- Matches -->
          <div v-if="matches.length > 0" class="space-y-5 mt-4">
            <h2 class="text-lg font-semibold text-stone-900 mb-1">{{ t.groupDetail.matches }}</h2>
            <MatchCard
              v-for="(match, index) in matches"
              :key="match.id"
              :match="match"
              :players="playersStore.players"
              :match-number="index + 1"
            />
          </div>
        </div>

        <!-- Scheduled Mode - Sub Pages -->
        <div v-if="isScheduledGroup">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-stone-900">Sessions</h2>
            <BaseButton
              variant="primary"
              size="sm"
              @click="isCreateSubPageModalOpen = true"
            >
              <PlusIcon class="w-4 h-4" />
              {{ t.groupDetail.addSubPage }}
            </BaseButton>
          </div>

          <!-- Sub-pages List -->
          <div v-if="subPages.length > 0" class="space-y-2">
            <button
              v-for="subPage in subPages"
              :key="subPage.id"
              class="w-full p-4 text-left rounded-lg bg-white border border-stone-200 hover:border-green-500 hover:bg-green-50 transition-all shadow-sm"
              @click="openSubPage(subPage.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <CalendarIcon class="w-5 h-5 text-stone-500" />
                  <div>
                    <p class="font-medium text-stone-900">{{ subPage.name }}</p>
                    <p class="text-sm text-stone-500">{{ formatDate(subPage.date) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-stone-600">{{ subPage.presentPlayerIds.length }} / {{ groupPlayers.length }}</span>
                  <CheckIcon class="w-5 h-5 text-green-600" />
                </div>
              </div>
            </button>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12 bg-white rounded-lg border border-stone-200">
            <CalendarIcon class="w-12 h-12 mx-auto text-stone-300 mb-3" />
            <p class="text-stone-500">{{ t.groupDetail.noSubPages }}</p>
            <p class="text-sm text-stone-400 mt-1">{{ t.groupDetail.createFirstSubPage }}</p>
          </div>
        </div>

        <!-- Players in Group -->
        <div v-if="groupPlayers.length > 0">
          <h2 class="text-lg font-semibold text-stone-900 mb-4">{{ t.players.title }}</h2>
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
          <p class="text-stone-500">{{ t.players.noPlayers }}</p>
        </div>

          <div class="mt-4 flex flex-row gap-4">
          <!-- Create New Player Button -->
            <BaseButton
              variant="secondary"
              full-width
              @click="isNewPlayerModalOpen = true"
            >
              <PlusIcon class="w-5 h-5" />
              {{ t.players.addPlayer }}
            </BaseButton>
            <!-- Add Player Button -->
            <BaseButton
            v-if="availablePlayers.length > 0"
            variant="primary"
            full-width
            @click="isAddPlayerModalOpen = true"
            >
            <UserPlusIcon class="w-5 h-5" />
            {{ t.players.addPlayer }}
            </BaseButton>
          </div>
        <BaseDivider />
        
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm" @click="openEditModal">
            <PencilIcon class="w-4 h-4" />
            {{ t.common.edit }}
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="handleDelete">
            <TrashIcon class="w-4 h-4" />
            {{ t.common.delete }}
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
          <h2 class="text-lg font-semibold text-stone-900">{{ t.players.addPlayer }}</h2>
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
            class="w-full p-4 text-left rounded-lg border border-stone-200 hover:border-green-500 hover:bg-green-50 transition-all shadow-sm"
            @click="addPlayerToGroup(player.id)"
          >
            <p class="font-medium text-stone-900">{{ player.name }}</p>
          </button>
          <p v-if="availablePlayers.length === 0" class="text-center text-stone-500 py-8">
            {{ t.players.noPlayers }}
          </p>
        </div>
      </div>
    </div>

    <!-- Create Sub-Page Modal -->
    <div
      v-if="isCreateSubPageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="isCreateSubPageModalOpen = false"
    >
      <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-stone-900">{{ t.groupDetail.addSubPage }}</h2>
          <button
            class="p-1 text-stone-500 hover:text-stone-700 transition-colors"
            @click="isCreateSubPageModalOpen = false"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-stone-700 mb-2">{{ t.groupDetail.subPageName }}</label>
            <input
              v-model="newSubPageName"
              type="text"
              :placeholder="t.groupDetail.subPageName"
              class="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              @keyup.enter="createSubPage"
            />
          </div>
          <div class="flex gap-3">
            <BaseButton variant="secondary" full-width @click="isCreateSubPageModalOpen = false">
              {{ t.common.cancel }}
            </BaseButton>
            <BaseButton variant="primary" full-width @click="createSubPage">
              {{ t.common.add }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub-Page Detail Modal (Attendance Tracking) -->
    <div
      v-if="selectedSubPage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeSubPage"
    >
      <div class="w-full h-full max-w-lg bg-white shadow-xl overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-stone-200">
          <div>
            <h2 class="text-lg font-semibold text-stone-900">{{ selectedSubPage.name }}</h2>
            <p class="text-sm text-stone-500">{{ formatDate(selectedSubPage.date) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="p-1 text-red-500 hover:text-red-700 transition-colors"
              @click="deleteSubPage(selectedSubPage.id)"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
            <button
              class="p-1 text-stone-500 hover:text-stone-700 transition-colors"
              @click="closeSubPage"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto flex-1">
          <div class="mb-4">
            <p class="text-sm text-stone-600">
              {{ selectedSubPage.presentPlayerIds.length }} of {{ groupPlayers.length }} players present
            </p>
          </div>
          <div class="space-y-2">
            <button
              v-for="player in groupPlayers"
              :key="player.id"
              class="w-full p-4 text-left rounded-lg border transition-all shadow-sm"
              :class="[
                selectedSubPage.presentPlayerIds.includes(player.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-stone-200 hover:border-stone-300'
              ]"
              @click="togglePlayerPresence(player.id)"
            >
              <div class="flex items-center justify-between">
                <p class="font-medium text-stone-900">{{ player.name }}</p>
                <CheckIcon
                  v-if="selectedSubPage.presentPlayerIds.includes(player.id)"
                  class="w-5 h-5 text-green-600"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
