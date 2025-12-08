<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'
import BottomNav from '@/organisms/BottomNav.vue'
import BaseButton from '@/components/BaseButton.vue'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { t, locale, availableLocales, setLocale } = useI18n()
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
  <div class="min-h-screen bg-amber-50 pb-20">
    <div class="max-w-lg mx-auto p-6 space-y-8">
      <!-- Header -->
      <header>
        <h1 class="text-3xl font-bold text-stone-900">{{ t.settings.title }}</h1>
        <p class="text-stone-600 mt-2">{{ t.settings.general }}</p>
      </header>

      <!-- Language Section -->
      <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-stone-200">
          <h2 class="text-lg font-semibold text-stone-900">{{ t.settings.language }}</h2>
          <p class="text-sm text-stone-600 mt-1">{{ t.settings.selectLanguage }}</p>
        </div>
        <div class="p-4 space-y-2">
          <BaseButton
            v-for="lang in availableLocales"
            :key="lang.code"
            @click="setLocale(lang.code)"
            variant="card"
            fullWidth
            :class="[
              locale === lang.code
                ? 'border-green-500 bg-green-50 text-green-700'
                : ''
            ]"
            class="text-left"
          >
            <span class="text-2xl">{{ lang.flag }}</span>
            <span class="font-medium">{{ lang.name }}</span>
            <span v-if="locale === lang.code" class="ml-auto text-green-600">✓</span>
          </BaseButton>
        </div>
      </div>

      <!-- Account Section -->
      <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-stone-200">
          <h2 class="text-lg font-semibold text-stone-900">{{ t.settings.account }}</h2>
          <p class="text-sm text-stone-600 mt-1">{{ t.settings.profile }}</p>
        </div>

        <div class="p-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span class="text-lg font-bold text-green-600">
                {{ authStore.user?.email?.charAt(0).toUpperCase() || 'U' }}
              </span>
            </div>
            <div>
              <p class="font-medium text-stone-900">{{ authStore.user?.email }}</p>
              <p class="text-sm text-stone-600">{{ t.settings.signedInAs }}</p>
            </div>
          </div>

          <BaseButton
            variant="danger"
            @click="handleLogout"
            :disabled="loggingOut"
            class="w-full flex items-center justify-center gap-2"
          >
            <ArrowRightEndOnRectangleIcon class="w-5 h-5" />
            {{ loggingOut ? t.common.loading : t.auth.signOut }}
          </BaseButton>
        </div>
      </div>
    </div>
    <BottomNav />
  </div>
</template>
