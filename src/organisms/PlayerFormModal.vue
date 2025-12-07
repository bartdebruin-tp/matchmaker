<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { usePlayersStore } from '@/stores/players'
import { useToast } from '@/composables/useToast'
import BaseModal from '@/components/BaseModal.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  editPlayerId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  editPlayerId: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const playersStore = usePlayersStore()
const toast = useToast()
const playerName = ref('')
const error = ref('')
const saving = ref(false)
const nameInputRef = ref<InstanceType<typeof BaseInput> | null>(null)

function initializeForm() {
  if (props.editPlayerId) {
    const player = playersStore.getPlayerById(props.editPlayerId)
    if (player) {
      playerName.value = player.name
    }
  } else {
    playerName.value = ''
  }
  error.value = ''
}

async function handleSave() {
  if (!playerName.value.trim()) {
    error.value = 'Player name is required'
    return
  }

  saving.value = true
  error.value = ''

  try {
    if (props.editPlayerId) {
      await playersStore.updatePlayer(props.editPlayerId, playerName.value.trim())
      toast.success('Player updated successfully')
      emit('saved')
    } else {
      await playersStore.addPlayer(playerName.value.trim())
      toast.success('Player added successfully')
      emit('saved')
      // Reset form for adding another player
      playerName.value = ''
      // Refocus the input after adding
      await nextTick()
      const inputElement = nameInputRef.value?.$el?.querySelector('input')
      if (inputElement) {
        inputElement.focus()
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to save player'
  } finally {
    saving.value = false
  }
}

function handleClose() {
  emit('close')
}

// Watch for modal opening and focus input
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    initializeForm()
    await nextTick()
    // Focus the input element inside BaseInput
    const inputElement = nameInputRef.value?.$el?.querySelector('input')
    if (inputElement) {
      inputElement.focus()
    }
  }
})
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="editPlayerId ? 'Edit Player' : 'Add Player'"
    @close="handleClose"
  >
    <template #close-icon>
      <XMarkIcon class="w-6 h-6" />
    </template>

    <form @submit.prevent="handleSave" class="space-y-4">
      <BaseInput
        ref="nameInputRef"
        v-model="playerName"
        label="Player Name"
        placeholder="Enter player name"
        :error="error"
      />

      <div class="flex gap-3">
        <BaseButton variant="secondary" full-width type="button" @click="handleClose" :disabled="saving">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" full-width type="submit" :disabled="saving">
          {{ saving ? 'Saving...' : (editPlayerId ? 'Update' : 'Add') }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
