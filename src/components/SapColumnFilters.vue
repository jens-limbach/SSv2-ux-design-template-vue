<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

interface Props {
  filters: FilterConfig[]
  modelValue: Record<string, string[]>
}

interface Emits {
  'update:modelValue': [value: Record<string, string[]>]
  clear: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for dropdowns
const openDropdown = ref<string | null>(null)

// Get active filter count for each filter
const getFilterCount = (key: string) => {
  return props.modelValue[key]?.length || 0
}

// Toggle dropdown
const toggleDropdown = (key: string) => {
  openDropdown.value = openDropdown.value === key ? null : key
}

// Close dropdown
const closeDropdown = () => {
  openDropdown.value = null
}

// Handle filter change
const handleFilterChange = (key: string, values: string[]) => {
  const newFilters = { ...props.modelValue }
  if (values.length === 0) {
    delete newFilters[key]
  } else {
    newFilters[key] = values
  }
  emit('update:modelValue', newFilters)
}

// Toggle checkbox
const toggleOption = (key: string, value: string) => {
  const currentValues = props.modelValue[key] || []
  const newValues = currentValues.includes(value)
    ? currentValues.filter(v => v !== value)
    : [...currentValues, value]
  handleFilterChange(key, newValues)
}

// Select all options for a filter
const selectAll = (key: string) => {
  const filter = props.filters.find(f => f.key === key)
  if (filter) {
    const allValues = filter.options.map(o => o.value)
    handleFilterChange(key, allValues)
  }
}

// Clear all options for a filter
const clearFilter = (key: string) => {
  handleFilterChange(key, [])
}

// Check if option is selected
const isSelected = (key: string, value: string) => {
  return props.modelValue[key]?.includes(value) || false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.sap-crm-filter-dropdown')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="sap-crm-filter-bar">
    <div class="sap-crm-filter-bar__filters">
      <div 
        v-for="filter in filters" 
        :key="filter.key"
        class="sap-crm-filter-dropdown"
      >
        <button
          type="button"
          class="sap-crm-btn sap-crm-flex sap-crm-btn--neutrallight sap-crm-btn--md"
          :class="{ 'sap-crm-btn--active': getFilterCount(filter.key) > 0 }"
          @click.stop="toggleDropdown(filter.key)"
        >
          <span class="sap-crm-btn--dropdown__text">
            {{ filter.label }}
            <span v-if="getFilterCount(filter.key) > 0" class="sap-crm-filter-count">
              ({{ getFilterCount(filter.key) }})
            </span>
          </span>
          <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--right">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.35146815,8.75146815 C6.82010434,8.28284395 7.57989666,8.28284395 8.04853285,8.75146815 L12,12.7029618 L15.9514841,8.75146815 C16.4200843,8.28284395 17.1799247,8.28284395 17.6485249,8.75146815 C18.117125,9.22010434 18.117125,9.97992066 17.6485249,10.4485209 L12.8485229,15.2485229 C12.3799227,15.717123 11.6200823,15.717123 11.1514821,15.2485229 L6.35146815,10.4485209 C5.88284395,9.97992066 5.88284395,9.22010434 6.35146815,8.75146815 Z"></path>
            </svg>
          </div>
        </button>
        
        <div 
          v-if="openDropdown === filter.key"
          class="sap-crm-filter-dropdown__menu"
          @click.stop
        >
          <div class="sap-crm-filter-dropdown__options">
            <label
              v-for="option in filter.options"
              :key="option.value"
              class="sap-crm-filter-dropdown__option"
            >
              <input
                type="checkbox"
                :checked="isSelected(filter.key, option.value)"
                @change="toggleOption(filter.key, option.value)"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
          
          <div class="sap-crm-filter-dropdown__actions">
            <button
              type="button"
              class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--xsm"
              @click="selectAll(filter.key)"
            >
              Select All
            </button>
            <button
              type="button"
              class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--xsm"
              @click="clearFilter(filter.key)"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
