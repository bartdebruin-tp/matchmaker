<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGroupsStore } from '@/stores/groups'
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
const groupName = ref('')
const groupColor = ref('bg-emerald-500')
const error = ref('')

function initializeForm() {
  if (props.editGroupId) {
    const group = groupsStore.getGroupById(props.editGroupId)
    if (group) {
      groupName.value = group.name
      groupColor.value = group.color
    }
  } else {
    groupName.value = ''
    groupColor.value = 'bg-emerald-500'
  }
  error.value = ''
}

function handleSave() {
  if (!groupName.value.trim()) {
    error.value = 'Group name is required'
    return
  }

  if (props.editGroupId) {
    groupsStore.updateGroup(props.editGroupId, groupName.value.trim(), groupColor.value)
  } else {
    groupsStore.addGroup(groupName.value.trim(), groupColor.value)
  }

  emit('saved')
  emit('close')
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

      <div class="flex gap-3">
        <BaseButton variant="secondary" full-width @click="handleClose">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" full-width @click="handleSave">
          {{ editGroupId ? 'Update' : 'Create' }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
