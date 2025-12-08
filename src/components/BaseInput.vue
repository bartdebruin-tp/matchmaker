<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  disabled?: boolean
  error?: string
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClasses = computed(() => {
  const baseClasses = 'w-full px-4 py-2 rounded-lg border transition-colors duration-200'
  const stateClasses = props.error 
    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
    : 'border-stone-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
  const disabledClasses = props.disabled ? 'bg-stone-100 cursor-not-allowed' : 'bg-white'
  
  return `${baseClasses} ${stateClasses} ${disabledClasses}`
})
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-stone-700 mb-1">
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :autofocus="autofocus"
      :class="inputClasses"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
