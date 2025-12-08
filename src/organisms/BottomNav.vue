<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { HomeIcon, UsersIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { t } = useI18n()

const navItems = computed(() => [
  { name: t.value.nav.home, icon: HomeIcon, path: '/' },
  { name: t.value.nav.players, icon: UsersIcon, path: '/players' },
  { name: t.value.nav.groups, icon: UserGroupIcon, path: '/groups' },
  { name: t.value.nav.settings, icon: Cog6ToothIcon, path: '/settings' }
])

function isActive(path: string): boolean {
  return router.currentRoute.value.path === path
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 safe-area-inset-bottom">
    <div class="flex justify-around items-center h-16 max-w-lg mx-auto">
      <button
        v-for="item in navItems"
        :key="item.path"
        :class="[
          'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors duration-200',
          isActive(item.path) ? 'text-green-600' : 'text-stone-500 hover:text-stone-700'
        ]"
        @click="router.push(item.path)"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-xs font-medium">{{ item.name }}</span>
      </button>
    </div>
  </nav>
</template>
