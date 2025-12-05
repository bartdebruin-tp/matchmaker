<script setup lang="ts">
import type { Group } from '@/types'

interface Props {
  group: Group
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="w-full p-4 rounded-lg border-2 border-stone-200 hover:border-stone-300 bg-white transition-all duration-200 text-left shadow-sm"
    @click="emit('click')"
  >
    <div class="flex items-center gap-4">
      <div :class="['w-4 h-4 rounded-full', props.group.color]" />
      <div class="flex-1">
        <p class="font-medium text-stone-900">{{ props.group.name }}</p>
        <p class="text-sm text-stone-500">{{ props.group.playerIds.length }} players</p>
      </div>
      <slot name="chevron-icon" />
    </div>
  </button>
</template>
