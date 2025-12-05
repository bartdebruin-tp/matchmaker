<script setup lang="ts">
interface Props {
  modelValue: string
  colors: string[]
}

const props = defineProps<Props>()


const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tailwindColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500'
]
</script>

<template>
  <div class="grid grid-cols-6 gap-2">
    <button
      v-for="color in tailwindColors"
      :key="color"
      type="button"
      :class="[
        'w-10 h-10 rounded-full transition-all duration-200',
        color,
        props.modelValue === color ? 'ring-4 ring-emerald-500 ring-offset-2' : 'hover:scale-110'
      ]"
      @click="emit('update:modelValue', color)"
    />
  </div>
</template>
