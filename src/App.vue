<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useStorageStore } from '@/stores/storage'

const storageStore = useStorageStore()

onMounted(() => {
  storageStore.loadData()
})
</script>

<template>
  <RouterView />
</template>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
