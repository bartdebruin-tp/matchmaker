<script setup lang="ts">
interface Props {
  spacing?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  spacing: 'md'
})

const spacingClasses = {
  sm: 'my-4',
  md: 'my-8',
  lg: 'my-12'
}
</script>

<template>
  <hr :class="['border-stone-200', spacingClasses[props.spacing]]" />
</template>
