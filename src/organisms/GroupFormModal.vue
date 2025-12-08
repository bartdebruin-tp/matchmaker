<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
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

const { t } = useI18n()
const groupsStore = useGroupsStore()
const toast = useToast()
const groupName = ref('')
const groupColor = ref('bg-green-500')
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
    groupColor.value = 'bg-green-500'
    matchType.value = 'random'
  }
  error.value = ''
}

async function handleSave() {
  if (!groupName.value.trim()) {
    error.value = t.value.errors.requiredField
    return
  }

  saving.value = true
  error.value = ''

  try {
    if (props.editGroupId) {
      await groupsStore.updateGroup(props.editGroupId, groupName.value.trim(), groupColor.value, matchType.value)
      toast.success(t.value.groups.groupUpdated)
    } else {
      await groupsStore.addGroup(groupName.value.trim(), groupColor.value, matchType.value)
      toast.success(t.value.groups.groupAdded)
    }

    emit('saved')
    emit('close')
  } catch (e: any) {
    error.value = e.message || t.value.errors.saveFailed
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
    :title="editGroupId ? t.groups.editGroup : t.groups.addGroup"
    @close="handleClose"
  >
    <template #close-icon>
      <XMarkIcon class="w-6 h-6" />
    </template>

    <div class="space-y-4">
      <BaseInput
        v-model="groupName"
        :label="t.groups.groupName"
        :placeholder="t.groups.groupName"
        :error="error"
        autofocus
      />

      <div>
        <label class="block text-sm font-medium text-stone-700 mb-3">
          {{ t.groups.groupColor }}
        </label>
        <ColorPicker
          v-model="groupColor"
          :colors="[]"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-stone-700 mb-3">
          {{ t.groups.matchType }}
        </label>
        <div class="space-y-2">
          <label class="flex items-center p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
            <input 
              type="radio" 
              v-model="matchType" 
              value="random" 
              class="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <div class="ml-3">
              <div class="text-sm font-medium text-stone-900">{{ t.groups.random }}</div>
              <div class="text-xs text-stone-500">{{ t.home.generateMatches }}</div>
            </div>
          </label>
          <label class="flex items-center p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
            <input 
              type="radio" 
              v-model="matchType" 
              value="scheduled" 
              class="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <div class="ml-3">
              <div class="text-sm font-medium text-stone-900">{{ t.groups.scheduled }}</div>
              <div class="text-xs text-stone-500">{{ t.groupDetail.playersAttending }}</div>
            </div>
          </label>
        </div>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="secondary" full-width @click="handleClose" :disabled="saving">
          {{ t.common.cancel }}
        </BaseButton>
        <BaseButton variant="primary" full-width @click="handleSave" :disabled="saving">
          {{ saving ? t.common.loading : (editGroupId ? t.common.save : t.common.add) }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
