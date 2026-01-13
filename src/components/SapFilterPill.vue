<script setup lang="ts">
interface Props {
  label: string
  removable?: boolean
}

interface Emits {
  remove: []
}

const props = withDefaults(defineProps<Props>(), {
  removable: true
})

const emit = defineEmits<Emits>()

const handleRemove = () => {
  emit('remove')
}
</script>

<template>
  <span class="sap-crm-filter-pill">
    <span class="sap-crm-filter-pill__label">{{ label }}</span>
    <button 
      v-if="removable"
      type="button"
      class="sap-crm-filter-pill__remove"
      @click="handleRemove"
      aria-label="Remove filter"
    >
      ✕
    </button>
  </span>
</template>
