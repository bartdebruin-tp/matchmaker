<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupsStore } from '@/stores/groups'
import { useStorageStore } from '@/stores/storage'
import BottomNav from '@/organisms/BottomNav.vue'
import BaseButton from '@/components/BaseButton.vue'
import GroupCard from '@/components/GroupCard.vue'
import GroupFormModal from '@/organisms/GroupFormModal.vue'
import { PlusIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const groupsStore = useGroupsStore()
const storageStore = useStorageStore()

const isModalOpen = ref(false)
const editGroupId = ref<string | null>(null)

function openAddModal() {
  editGroupId.value = null
  isModalOpen.value = true
}

function handleGroupClick(groupId: string) {
  router.push(`/groups/${groupId}`)
}

function handleSaved() {
  storageStore.saveData()
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 pb-20">
    <div class="max-w-lg mx-auto p-4 space-y-8">
      <!-- Header -->
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-stone-900">Groups</h1>
          <p class="text-stone-600 mt-2">{{ groupsStore.groups.length }} total</p>
        </div>
        <BaseButton variant="primary" @click="openAddModal">
          <PlusIcon class="w-5 h-5" />
          Add
        </BaseButton>
      </header>

      <!-- Groups List -->
      <div v-if="groupsStore.groups.length > 0" class="space-y-2">
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

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-stone-500 mb-4">No groups yet</p>
        <BaseButton variant="primary" @click="openAddModal">
          <PlusIcon class="w-5 h-5" />
          Create First Group
        </BaseButton>
      </div>
    </div>

    <BottomNav />

    <GroupFormModal
      :is-open="isModalOpen"
      :edit-group-id="editGroupId"
      @close="isModalOpen = false"
      @saved="handleSaved"
    />
  </div>
</template>
