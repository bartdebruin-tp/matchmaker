<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayersStore } from '@/stores/players'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import BottomNav from '@/organisms/BottomNav.vue'
import BaseButton from '@/components/BaseButton.vue'
import { 
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()
const playersStore = usePlayersStore()
const groupsStore = useGroupsStore()
const authStore = useAuthStore()

const loggingOut = ref(false)

async function handleLogout() {
  loggingOut.value = true
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 pb-24">
    <div class="max-w-lg mx-auto p-6 space-y-8">
      <!-- Header -->
      <header>
        <h1 class="text-3xl font-bold text-stone-900">Settings</h1>
        <p class="text-stone-600 mt-2">Manage your account and preferences</p>
      </header>

      <!-- Account Section -->
      <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-stone-200">
          <h2 class="text-lg font-semibold text-stone-900">Account</h2>
          <p class="text-sm text-stone-600 mt-1">Manage your account settings</p>
        </div>

        <div class="p-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <span class="text-lg font-bold text-emerald-600">
                {{ authStore.user?.email?.charAt(0).toUpperCase() || 'U' }}
              </span>
            </div>
            <div>
              <p class="font-medium text-stone-900">{{ authStore.user?.email }}</p>
              <p class="text-sm text-stone-600">Signed in</p>
            </div>
          </div>

          <BaseButton
            variant="danger"
            @click="handleLogout"
            :disabled="loggingOut"
            class="w-full flex items-center justify-center gap-2"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
            {{ loggingOut ? 'Signing out...' : 'Sign Out' }}
          </BaseButton>
        </div>
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

    <BottomNav />
  </div>
</template>
