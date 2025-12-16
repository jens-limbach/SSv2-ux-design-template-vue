<script setup lang="ts">
interface Props {
  modelValue: boolean
  id?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="sap-crm-icontrol sap-crm-icontrol__switch">
    <input 
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--switch">
      <div class="sap-crm-icontrol__icon"></div>
    </div>
  </div>
</template>
