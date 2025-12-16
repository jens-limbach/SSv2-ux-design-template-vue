<script setup lang="ts">
interface RadioOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: RadioOption[]
  name: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleChange = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem;">
    <div 
      v-for="option in options" 
      :key="option.value"
      style="display: flex; align-items: center; gap: 0.5rem;">
      <div class="sap-crm-icontrol sap-crm-icontrol__radio">
        <input 
          :id="`${name}-${option.value}`"
          type="radio" 
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="handleChange(option.value)"
        />
        <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--radio"></div>
      </div>
      <label :for="`${name}-${option.value}`" style="margin: 0;">{{ option.label }}</label>
    </div>
  </div>
</template>
