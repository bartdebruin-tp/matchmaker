<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '@/types'
import BaseButton from '@/components/BaseButton.vue'

interface Props {
  player: Player
  isActive?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  showActions: false
})

const emit = defineEmits<{
  toggle: []
  edit: []
  delete: []
}>()

const cardClasses = computed(() => {
  const baseClasses = 'rounded-lg border-2 transition-all duration-200 shadow-sm'
  const activeClasses = props.isActive
    ? 'border-green-500 bg-green-50'
    : 'border-stone-200 bg-white hover:border-stone-300'
  
  return `${baseClasses} ${activeClasses}`
})
</script>

<template>
  <div :class="cardClasses">
    <div class="flex items-center justify-between">
      <BaseButton
        variant="transparent"
        fullWidth
        @click="emit('toggle')"
        class="text-left"
      >
        <p class="font-medium text-stone-900">{{ player.name }}</p>
      </BaseButton>
      
      <div v-if="showActions" class="flex items-center gap-2 ml-4">
        <button
          class="p-4 text-stone-500 hover:text-green-600 transition-colors"
          @click="emit('edit')"
        >
          <slot name="edit-icon" />
        </button>
        <button
          class="p-4 text-stone-500 hover:text-red-600 transition-colors"
          @click="emit('delete')"
        >
          <slot name="delete-icon" />
        </button>
      </div>
    </div>
  </div>
</template>
