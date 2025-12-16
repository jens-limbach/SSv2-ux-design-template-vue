<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'url' | 'tel'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputClass = computed(() => {
  const classes = ['sap-crm-input']
  if (props.error) classes.push('sap-crm-input--error')
  if (props.disabled) classes.push('sap-crm-input--disabled')
  return classes.join(' ')
})
</script>

<template>
  <div :class="inputClass">
    <input 
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
    />
  </div>
</template>
