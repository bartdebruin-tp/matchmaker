<script setup lang="ts">
import { ref } from 'vue'
import { useStorageStore } from '@/stores/storage'
import { usePlayersStore } from '@/stores/players'
import { useGroupsStore } from '@/stores/groups'
import BottomNav from '@/organisms/BottomNav.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import { 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'
import type { AppData } from '@/types'

const storageStore = useStorageStore()
const playersStore = usePlayersStore()
const groupsStore = useGroupsStore()

const fileInput = ref<HTMLInputElement | null>(null)
const showClearModal = ref(false)
const showUploadModal = ref(false)
const uploadError = ref('')

function downloadData() {
  const data: AppData = {
    players: playersStore.players,
    groups: groupsStore.groups,
    activePlayerIds: groupsStore.getActivePlayers()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `matchmaker-data-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function triggerFileInput() {
  uploadError.value = ''
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const data: AppData = JSON.parse(content)
      
      // Validate the data structure
      if (!data.players || !data.groups || !Array.isArray(data.players) || !Array.isArray(data.groups)) {
        uploadError.value = 'Invalid data format. Please upload a valid MatchMaker data file.'
        return
      }

      // Load the data
      playersStore.setPlayers(data.players)
      groupsStore.setGroups(data.groups)
      groupsStore.setActivePlayerIds(data.activePlayerIds || [])
      
      // Save to localStorage
      storageStore.saveData()
      
      showUploadModal.value = true
      uploadError.value = ''
    } catch (error) {
      uploadError.value = 'Failed to parse JSON file. Please check the file format.'
      console.error('Upload error:', error)
    }
  }
  
  reader.readAsText(file)
  
  // Reset the input
  target.value = ''
}

function confirmClearData() {
  // Clear the stores first
  playersStore.setPlayers([])
  groupsStore.setGroups([])
  groupsStore.setActivePlayerIds([])
  
  // Clear localStorage
  storageStore.clearData()
  
  // Close modal
  showClearModal.value = false
  
  // Redirect to homepage with fresh reload
  window.location.href = '/'
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 pb-24">
    <div class="max-w-lg mx-auto p-6 space-y-8">
      <!-- Header -->
      <header>
        <h1 class="text-3xl font-bold text-stone-900">Settings</h1>
        <p class="text-stone-600 mt-2">Manage your data and preferences</p>
      </header>

      <!-- Data Management Section -->
      <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-stone-200">
          <h2 class="text-lg font-semibold text-stone-900">Data Management</h2>
          <p class="text-sm text-stone-600 mt-1">Export, import, or clear your data</p>
        </div>

        <div class="divide-y divide-stone-200">
          <!-- Download Data -->
          <button
            @click="downloadData"
            class="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors duration-200"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ArrowDownTrayIcon class="w-5 h-5 text-emerald-600" />
              </div>
              <div class="text-left">
                <p class="font-medium text-stone-900">Download Data</p>
                <p class="text-sm text-stone-600">Export all data as JSON</p>
              </div>
            </div>
          </button>

          <!-- Upload Data -->
          <button
            @click="triggerFileInput"
            class="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors duration-200"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ArrowUpTrayIcon class="w-5 h-5 text-blue-600" />
              </div>
              <div class="text-left">
                <p class="font-medium text-stone-900">Upload Data</p>
                <p class="text-sm text-stone-600">Import data from JSON file</p>
              </div>
            </div>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleFileUpload"
          />

          <!-- Clear Data -->
          <button
            @click="showClearModal = true"
            class="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors duration-200"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <TrashIcon class="w-5 h-5 text-red-600" />
              </div>
              <div class="text-left">
                <p class="font-medium text-stone-900">Reset All Data</p>
                <p class="text-sm text-stone-600">Reset for a fresh start</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="uploadError"
        class="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <p class="text-sm text-red-800">{{ uploadError }}</p>
      </div>

      <!-- Info Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-900 font-medium mb-2">About Data Storage</p>
        <p class="text-sm text-blue-800">
          Your data is stored locally in your browser. Use the download feature to backup your data,
          and upload to restore it on another device or browser.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <p class="text-sm text-stone-600 mb-1">Total Players</p>
          <p class="text-2xl font-bold text-stone-900">{{ playersStore.players.length }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <p class="text-sm text-stone-600 mb-1">Total Groups</p>
          <p class="text-2xl font-bold text-stone-900">{{ groupsStore.groups.length }}</p>
        </div>
      </div>
    </div>

    <!-- Clear Confirmation Modal -->
    <BaseModal
      :isOpen="showClearModal"
      title="Reset All Data?"
      @close="showClearModal = false"
    >
      <div class="space-y-4">
        <p class="text-stone-700">
          This will permanently delete all players, groups, and matches. This action cannot be undone.
        </p>
        <p class="text-sm text-stone-600">
          Make sure to download your data first if you want to keep a backup.
        </p>
        <div class="flex gap-3 justify-end">
          <BaseButton
            variant="secondary"
            @click="showClearModal = false"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="danger"
            @click="confirmClearData"
          >
            Reset Data
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Upload Success Modal -->
    <BaseModal
      :isOpen="showUploadModal"
      title="Data Uploaded Successfully"
      @close="showUploadModal = false"
    >
      <div class="space-y-4">
        <p class="text-stone-700">
          Your data has been successfully imported and saved.
        </p>
        <div class="flex justify-end">
          <BaseButton @click="showUploadModal = false">
            OK
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <BottomNav />
  </div>
</template>
