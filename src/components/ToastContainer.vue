<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const { toasts, remove } = useToast()

const typeConfig = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    iconColor: 'text-green-500'
  },
  error: {
    icon: ExclamationCircleIcon,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    iconColor: 'text-red-500'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500'
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 pointer-events-auto',
          typeConfig[toast.type].bgColor,
          typeConfig[toast.type].borderColor,
          'animate-slide-in'
        ]"
      >
        <component
          :is="typeConfig[toast.type].icon"
          :class="['w-6 h-6 shrink-0', typeConfig[toast.type].iconColor]"
        />
        <p :class="['flex-1 text-sm font-medium', typeConfig[toast.type].textColor]">
          {{ toast.message }}
        </p>
        <button
          @click="remove(toast.id)"
          :class="['shrink-0 hover:opacity-70 transition-opacity', typeConfig[toast.type].textColor]"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
