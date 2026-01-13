<script setup lang="ts">
type Priority = 'High' | 'Medium' | 'Low'

interface Props {
  modelValue: Priority
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Priority]
}>()

const priorities = [
  { value: 'High' as Priority, label: 'High', color: 'red' },
  { value: 'Medium' as Priority, label: 'Medium', color: 'yellow' },
  { value: 'Low' as Priority, label: 'Low', color: 'blue' }
]

const selectPriority = (priority: Priority) => {
  emit('update:modelValue', priority)
}
</script>

<template>
  <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
    <button
      v-for="priority in priorities"
      :key="priority.value"
      type="button"
      class="sap-crm-btn sap-crm-btn--toggle sap-crm-btn--sm"
      :class="`sap-crm-btn--toggle--${priority.color}`"
      :style="{ opacity: modelValue === priority.value ? 1 : 0.5 }"
      @click="selectPriority(priority.value)">
      {{ priority.label }}
    </button>
  </div>
</template>
