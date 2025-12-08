<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { usePlayersStore } from '@/stores/players'
import { useStorageStore } from '@/stores/storage'
import { useToast } from '@/composables/useToast'
import BottomNav from '@/organisms/BottomNav.vue'
import BaseButton from '@/components/BaseButton.vue'
import PlayerCard from '@/components/PlayerCard.vue'
import PlayerFormModal from '@/organisms/PlayerFormModal.vue'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const playersStore = usePlayersStore()
const storageStore = useStorageStore()
const toast = useToast()

const isModalOpen = ref(false)
const editPlayerId = ref<string | null>(null)

onMounted(async () => {
  try {
    await playersStore.fetchPlayers()
  } catch (error) {
    console.error('Error loading players:', error)
  }
})

const sortedPlayers = computed(() => {
  return [...playersStore.players].sort((a, b) => a.name.localeCompare(b.name))
})

function openAddModal() {
  editPlayerId.value = null
  isModalOpen.value = true
}

function openEditModal(playerId: string) {
  editPlayerId.value = playerId
  isModalOpen.value = true
}

async function handleDelete(playerId: string) {
  if (confirm(t.value.players.deleteMessage)) {
    try {
      await playersStore.deletePlayer(playerId)
      storageStore.saveData()
      toast.success(t.value.players.playerDeleted)
    } catch (error) {
      console.error('Error deleting player:', error)
      toast.error('Failed to delete player')
    }
  }
}

function handleSaved() {
  storageStore.saveData()
}
</script>

<template>
  <div class="min-h-screen bg-amber-50 pb-20">
    <div class="max-w-lg mx-auto p-4 space-y-8">
      <!-- Header -->
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-stone-900">{{ t.players.title }}</h1>
          <p class="text-stone-600 mt-2">{{ playersStore.players.length }} {{ t.common.total }}</p>
        </div>
        <BaseButton variant="primary" @click="openAddModal">
          <PlusIcon class="w-5 h-5" />
          {{ t.common.add }}
        </BaseButton>
      </header>

      <!-- Players List -->
      <div v-if="playersStore.players.length > 0" class="space-y-2">
        <PlayerCard
          v-for="player in sortedPlayers"
          :key="player.id"
          :player="player"
          :show-actions="true"
          @edit="openEditModal(player.id)"
          @delete="handleDelete(player.id)"
        >
          <template #edit-icon>
            <PencilIcon class="w-5 h-5" />
          </template>
          <template #delete-icon>
            <TrashIcon class="w-5 h-5" />
          </template>
        </PlayerCard>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-stone-500 mb-4">{{ t.players.noPlayers }}</p>
        <BaseButton variant="primary" @click="openAddModal">
          <PlusIcon class="w-5 h-5" />
          {{ t.players.createFirstPlayer }}
        </BaseButton>
      </div>
    </div>

    <BottomNav />

    <PlayerFormModal
      :is-open="isModalOpen"
      :edit-player-id="editPlayerId"
      @close="isModalOpen = false"
      @saved="handleSaved"
    />
  </div>
</template>
