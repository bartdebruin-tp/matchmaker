<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false
})

const classes = computed(() => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 flex items-center justify-space-between gap-2'
  
  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-300',
    secondary: 'bg-stone-200 hover:bg-stone-300 text-stone-900 disabled:bg-stone-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const widthClass = props.fullWidth ? 'w-full' : ''
  const disabledClass = props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
  
  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${widthClass} ${disabledClass}`
})
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
