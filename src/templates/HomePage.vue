<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { usePlayersStore } from '@/stores/players'
import { useGroupsStore } from '@/stores/groups'
import { useStorageStore } from '@/stores/storage'
import { useRouter } from 'vue-router'
import BottomNav from '@/organisms/BottomNav.vue'
import GroupCard from '@/components/GroupCard.vue'
import GroupFormModal from '@/organisms/GroupFormModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import { ChevronRightIcon, PlusIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const playersStore = usePlayersStore()
const groupsStore = useGroupsStore()
const storageStore = useStorageStore()
const router = useRouter()

const isModalOpen = ref(false)
const shouldNavigateToNewGroup = ref(false)
const loading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([
      playersStore.fetchPlayers(),
      groupsStore.fetchGroups()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})

function handleGroupClick(groupId: string) {
  router.push(`/groups/${groupId}`)
}

function openAddModal() {
  shouldNavigateToNewGroup.value = true
  isModalOpen.value = true
}

function handleSaved() {
  storageStore.saveData()
  
  if (shouldNavigateToNewGroup.value && groupsStore.groups.length > 0) {
    // Navigate to the most recently created group
    const latestGroup = groupsStore.groups[groupsStore.groups.length - 1]
    router.push(`/groups/${latestGroup.id}`)
  }
  
  shouldNavigateToNewGroup.value = false
}
</script>

<template>
  <div class="min-h-screen bg-amber-50 pb-20">
    <div class="max-w-lg mx-auto p-6 space-y-8">
      <!-- Header -->
      <header>
        <h1 class="text-3xl font-bold text-stone-900">{{ t.home.title }}</h1>
        <p class="text-stone-600 mt-2">{{ t.home.subtitle }}</p>
      </header>

      <!-- Quick Access Groups -->
      <div v-if="groupsStore.groups.length > 0">
        <h2 class="text-xl font-semibold text-stone-900 mb-4">{{ t.home.recentGroups }}</h2>
        <div class="space-y-2">
          <GroupCard
            v-for="group in groupsStore.groups"
            :key="group.id"
            :group="group"
            @click="handleGroupClick(group.id)"
          >
            <template #chevron-icon>
              <ChevronRightIcon class="w-5 h-5 text-stone-400" />
            </template>
          </GroupCard>
        </div>
      </div>
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <h2 class="text-xl font-semibold text-stone-900 mb-4">{{ t.home.noGroups }}</h2>
        <p class="text-sm text-stone-400 mt-1 mb-6">{{ t.home.createFirstGroup }}</p>
        <BaseButton variant="primary" @click="openAddModal">
          <PlusIcon class="w-5 h-5" />
          {{ t.groups.addGroup }}
        </BaseButton>
      </div>


      <!-- Overview Stats -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <p class="text-sm text-stone-600 mb-1">{{ t.players.totalPlayers }}</p>
          <p class="text-2xl font-bold text-stone-900">{{ playersStore.players.length }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <p class="text-sm text-stone-600 mb-1">{{ t.groups.totalGroups }}</p>
          <p class="text-2xl font-bold text-stone-900">{{ groupsStore.groups.length }}</p>
        </div>
      </div>
    </div>
    <BottomNav />
    
    <!-- Group Form Modal -->
    <GroupFormModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @saved="handleSaved"
    />
  </div>
</template>
