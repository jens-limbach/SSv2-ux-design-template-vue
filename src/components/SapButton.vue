<script setup lang="ts">
import type { ButtonVariant, ButtonSize } from '@/types'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  iconOnly?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  iconOnly: false,
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const getButtonClasses = () => {
  const classes = ['sap-crm-btn']
  
  classes.push(`sap-crm-btn--${props.variant}`)
  classes.push(`sap-crm-btn--${props.size}`)
  
  if (props.iconOnly) {
    classes.push(`sap-crm-btn--${props.size}--icon_only`)
  }
  
  return classes.join(' ')
}

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="getButtonClasses()"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
