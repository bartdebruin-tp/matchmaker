<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGroupsStore } from '@/stores/groups'
import { useToast } from '@/composables/useToast'
import BaseModal from '@/components/BaseModal.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  editGroupId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  editGroupId: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const groupsStore = useGroupsStore()
const toast = useToast()
const groupName = ref('')
const groupColor = ref('bg-emerald-500')
const matchType = ref<'random' | 'scheduled'>('random')
const error = ref('')
const saving = ref(false)

function initializeForm() {
  if (props.editGroupId) {
    const group = groupsStore.getGroupById(props.editGroupId)
    if (group) {
      groupName.value = group.name
      groupColor.value = group.color
      matchType.value = group.matchType
    }
  } else {
    groupName.value = ''
    groupColor.value = 'bg-emerald-500'
    matchType.value = 'random'
  }
  error.value = ''
}

async function handleSave() {
  if (!groupName.value.trim()) {
    error.value = 'Group name is required'
    return
  }

  saving.value = true
  error.value = ''

  try {
    if (props.editGroupId) {
      await groupsStore.updateGroup(props.editGroupId, groupName.value.trim(), groupColor.value, matchType.value)
      toast.success('Group updated successfully')
    } else {
      await groupsStore.addGroup(groupName.value.trim(), groupColor.value, matchType.value)
      toast.success('Group created successfully')
    }

    emit('saved')
    emit('close')
  } catch (e: any) {
    error.value = e.message || 'Failed to save group'
  } finally {
    saving.value = false
  }
}

function handleClose() {
  emit('close')
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    initializeForm()
  }
})
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="editGroupId ? 'Edit Group' : 'Create Group'"
    @close="handleClose"
  >
    <template #close-icon>
      <XMarkIcon class="w-6 h-6" />
    </template>

    <div class="space-y-4">
      <BaseInput
        v-model="groupName"
        label="Group Name"
        placeholder="Enter group name"
        :error="error"
        autofocus
      />

      <div>
        <label class="block text-sm font-medium text-stone-700 mb-3">
          Group Color
        </label>
        <ColorPicker
          v-model="groupColor"
          :colors="[]"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-stone-700 mb-3">
          Match Type
        </label>
        <div class="space-y-2">
          <label class="flex items-center p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
            <input 
              type="radio" 
              v-model="matchType" 
              value="random" 
              class="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
            />
            <div class="ml-3">
              <div class="text-sm font-medium text-stone-900">Random Matches</div>
              <div class="text-xs text-stone-500">Generate random match pairings</div>
            </div>
          </label>
          <label class="flex items-center p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
            <input 
              type="radio" 
              v-model="matchType" 
              value="scheduled" 
              class="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
            />
            <div class="ml-3">
              <div class="text-sm font-medium text-stone-900">Scheduled</div>
              <div class="text-xs text-stone-500">Track attendance across multiple sessions</div>
            </div>
          </label>
        </div>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="secondary" full-width @click="handleClose" :disabled="saving">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" full-width @click="handleSave" :disabled="saving">
          {{ saving ? 'Saving...' : (editGroupId ? 'Update' : 'Create') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
