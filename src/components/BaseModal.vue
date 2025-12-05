<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-lg bg-white rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 v-if="props.title" class="text-lg font-semibold text-stone-900">{{ props.title }}</h2>
          <button
            class="p-1 text-stone-500 hover:text-stone-700 transition-colors"
            @click="emit('close')"
          >
            <slot name="close-icon" />
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: translateY(100%);
}
</style>
