<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Account } from '@/types'
import SapButton from './SapButton.vue'
import SapSwitch from './SapSwitch.vue'
import SapInput from './SapInput.vue'
import SapSelect from './SapSelect.vue'
import { useAccountStore } from '@/stores/useAccountStore'

const accountStore = useAccountStore()

const getAbcColor = (description: string): string => {
  // Check the last character for A, B, or C
  const lastChar = description.trim().slice(-1).toUpperCase()
  if (lastChar === 'A') return 'red'
  if (lastChar === 'C') return 'yellow'
  return 'blue' // B or default
}

const getAbcLabel = (description: string): string => {
  // Extract and return "Account A", "Account B", or "Account C"
  if (!description || description.trim() === '') return ''
  const lastChar = description.trim().slice(-1).toUpperCase()
  if (['A', 'B', 'C'].includes(lastChar)) {
    return `Account ${lastChar}`
  }
  return ''
}

interface Props {
  account: Account
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

const emit = defineEmits<{
  click: []
  delete: [id: string]
  update: [field: keyof Account, value: any]
}>()

// Editing state
const editingField = ref<keyof Account | null>(null)
const editValue = ref<any>(null)

// Dropdown options
const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'In Preparation', label: 'In Preparation' },
  { value: 'Blocked', label: 'Blocked' },
  { value: 'Obsolete', label: 'Obsolete' }
]

const countryOptions = [
  { value: 'US', label: 'United States (US)' },
  { value: 'DE', label: 'Germany (DE)' },
  { value: 'GB', label: 'United Kingdom (GB)' },
  { value: 'FR', label: 'France (FR)' },
  { value: 'IT', label: 'Italy (IT)' },
  { value: 'ES', label: 'Spain (ES)' },
  { value: 'CA', label: 'Canada (CA)' },
  { value: 'AU', label: 'Australia (AU)' },
  { value: 'JP', label: 'Japan (JP)' },
  { value: 'CN', label: 'China (CN)' },
  { value: 'IN', label: 'India (IN)' },
  { value: 'BR', label: 'Brazil (BR)' }
]

const industryOptions = computed(() => 
  accountStore.industries.map(ind => ({ value: ind.id, label: ind.description }))
)

const contactOptions = computed(() => 
  accountStore.contacts.map(contact => ({ 
    value: contact.id, 
    label: `${contact.formattedName} (${contact.displayId})` 
  }))
)

const ownerOptions = computed(() => 
  accountStore.employees.map(emp => ({ 
    value: emp.id, 
    label: `${emp.formattedName} (${emp.displayId})` 
  }))
)

const abcOptions = [
  { value: 'A', label: 'Account A', description: 'Customer ABC Classification A', color: 'red' },
  { value: 'B', label: 'Account B', description: 'Customer ABC Classification B', color: 'blue' },
  { value: 'C', label: 'Account C', description: 'Customer ABC Classification C', color: 'yellow' }
]

// Start editing a field
const startEditing = (field: keyof Account, event: Event) => {
  event.stopPropagation()
  editingField.value = field
  
  // Set initial value based on field type
  if (field === 'primaryContactId') {
    editValue.value = props.account.primaryContactId
  } else if (field === 'ownerId') {
    editValue.value = props.account.ownerId
  } else if (field === 'abcClassification') {
    // Extract letter from description
    const lastChar = props.account.abcClassificationDescription?.trim().slice(-1).toUpperCase()
    editValue.value = ['A', 'B', 'C'].includes(lastChar) ? lastChar : 'B'
  } else if (field === 'industry') {
    // Use industryCode for editing, not the description
    editValue.value = props.account.industryCode || props.account.industry
  } else {
    editValue.value = props.account[field]
  }
}

// Save the edited value
const saveEdit = async () => {
  if (editingField.value === null) return
  
  const field = editingField.value
  let valueToSave = editValue.value
  
  // Handle special cases
  if (field === 'primaryContactId') {
    // Also update the display name
    const contact = accountStore.contacts.find(c => c.id === editValue.value)
    if (contact) {
      emit('update', 'contactPerson', contact.formattedName)
    }
  } else if (field === 'ownerId') {
    // Also update the display name
    const employee = accountStore.employees.find(e => e.id === editValue.value)
    if (employee) {
      emit('update', 'owner', employee.formattedName)
    }
  } else if (field === 'abcClassification') {
    // Update both ID and description
    const option = abcOptions.find(opt => opt.value === editValue.value)
    if (option) {
      emit('update', 'abcClassification', editValue.value)
      emit('update', 'abcClassificationDescription', option.description)
      editingField.value = null
      return
    }
  } else if (field === 'industry') {
    // Update both code and description
    const industry = accountStore.industries.find(ind => ind.id === editValue.value)
    if (industry) {
      emit('update', 'industryCode', industry.id)
      emit('update', 'industry', industry.description)
      editingField.value = null
      return
    }
  }
  
  emit('update', field, valueToSave)
  editingField.value = null
}

// Cancel editing
const cancelEdit = () => {
  editingField.value = null
  editValue.value = null
}

// Handle ABC classification selection
const selectAbcClassification = (value: string, event: Event) => {
  event.stopPropagation()
  editValue.value = value
  // Auto-save immediately for toggle buttons
  setTimeout(() => saveEdit(), 0)
}

// Toggle prospect switch
const toggleProspect = (event: Event) => {
  event.stopPropagation()
  emit('update', 'prospect', !props.account.prospect)
}

const getStateClass = () => {
  const { status } = props.account
  
  // Map status to color
  if (status === 'Active') {
    return 'sap-crm-table__state--success'
  }
  
  if (status === 'In Preparation' || status === 'Blocked') {
    return 'sap-crm-table__state--caution'
  }
  
  if (status === 'Obsolete') {
    return 'sap-crm-table__state--error'
  }
  
  return ''
}

const rowClass = computed(() => {
  const classes = ['sap-crm-table__row']
  if (props.selected) {
    classes.push('sap-crm-table__row--selected')
  }
  return classes.join(' ')
})

const handleDelete = (event: Event) => {
  event.stopPropagation()
  if (confirm(`Are you sure you want to delete account "${props.account.companyName}"?`)) {
    emit('delete', props.account.accountId)
  }
}

// Navigate to CRM entity
const navigateToCrm = (routingKey: string, objectKey: string) => {
  const message = {
    operation: 'navigation',
    params: {
      objectKey: objectKey,
      routingKey: routingKey,
      viewType: 'quickview'
    }
  }
  window.parent.postMessage(message, '*')
}
</script>

<template>
  <tr :class="rowClass">
    <!-- Account ID (non-editable) -->
    <td class="sap-crm-table__cell">
      <div :class="`sap-crm-table__state ${getStateClass()}`"></div>
      {{ account.accountId }}
    </td>
    
    <!-- Company Name (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'companyName'">
          <SapInput
            v-model="editValue"
            type="text"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.escape="cancelEdit"
            style="flex: 1; min-width: 150px;"
          />
        </template>
        <template v-else>
          <span 
            v-if="account.id"
            class="sap-crm-table__nav-link" 
            @click.stop="navigateToCrm('mdaccount', account.id)">
            {{ account.companyName }}
          </span>
          <span v-else>{{ account.companyName }}</span>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="edit-icon-btn"
            @click.stop="emit('click')"
            :aria-label="`Edit ${account.companyName}`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0037,3 C10.5559,3 11.0037,3.44772 11.0037,4 C11.0037,4.55228 10.5559,5 10.0037,5 L6,5 C5.44772,5 5,5.44772 5,6 L5,18 C5,18.5523 5.44772,19 6,19 L18.0037,19 C18.5559,19 19.0037,18.5523 19.0037,18 L19.0037,14 C19.0037,13.4477 19.4514,13 20.0037,13 C20.5559,13 21.0037,13.4477 21.0037,14 L21.0037,18 C21.0037,19.6569 19.6605,21 18.0037,21 L6,21 C4.34315,21 3,19.6569 3,18 L3,6 C3,4.34315 4.34315,3 6,3 L10.0037,3 Z M20,3 L20.0193547,3.00018615 C20.0426815,3.00063489 20.0659956,3.00189496 20.089251,3.00396636 L20,3 C20.0506217,3 20.1003646,3.00376123 20.1489647,3.01101945 C20.1659506,3.01362793 20.183377,3.01670199 20.2007276,3.02023985 C20.2227508,3.02464003 20.2444415,3.02983391 20.2658449,3.0357213 C20.2814655,3.04009729 20.2968536,3.04472822 20.3121448,3.04973754 C20.3318037,3.05612298 20.3515854,3.06331629 20.3710648,3.07110458 C20.3887978,3.07819556 20.4061005,3.08567811 20.4232234,3.09367233 C20.4438981,3.10337749 20.4643007,3.11379483 20.4842837,3.12487675 C20.4963954,3.13149738 20.5086138,3.1386054 20.5207092,3.14599385 C20.5462817,3.16171991 20.5711374,3.17849139 20.5951659,3.19631489 C20.6026012,3.20175123 20.6098403,3.2072822 20.61702,3.21292535 C20.6798642,3.2622995 20.7368692,3.31923598 20.7864564,3.38228152 L20.7071,3.29289 C20.7424919,3.32828457 20.7746761,3.36567215 20.8036526,3.40469147 C20.8215141,3.42887139 20.8382852,3.45372715 20.8539361,3.47934192 C20.8613767,3.49138565 20.8684844,3.50360439 20.8753116,3.5159368 C20.886209,3.53570816 20.8966261,3.55611069 20.9063487,3.57690291 C20.9143013,3.59390079 20.9217834,3.6112037 20.9287539,3.62866339 C20.936686,3.64842272 20.9438791,3.6682042 20.9504547,3.6882654 C20.9552491,3.70314829 20.9598798,3.71853639 20.9641321,3.73400673 C20.9701673,3.75556509 20.975361,3.77725539 20.9798355,3.79920726 C20.9832739,3.81662457 20.9863478,3.83405084 20.9889579,3.85153301 C20.9920331,3.87147629 20.9944668,3.89211478 20.9962625,3.91293567 C20.9978187,3.93173446 20.9988803,3.94973359 20.999458,3.96774536 C20.9998183,3.9777894 21,3.98887348 21,4 L21,9 C21,9.55228 20.5523,10 20,10 C19.4477,10 19,9.55228 19,9 L19,6.414 L9.70711,15.7071 C9.31658,16.0976 8.68342,16.0976 8.29289,15.7071 C7.90237,15.3166 7.90237,14.6834 8.29289,14.2929 L17.584,5 L15,5 C14.4477,5 14,4.55228 14,4 C14,3.44772 14.4477,3 15,3 L20,3 Z"></path>
              </svg>
            </div>
          </SapButton>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('companyName', $event)"
            :aria-label="`Edit company name inline`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Prospect (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <SapSwitch :model-value="account.prospect" @click="toggleProspect" />
      </div>
    </td>
    
    <!-- ABC Classification (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'abcClassification'">
          <div style="display: flex; gap: 0.5rem;">
            <button
              v-for="option in abcOptions"
              :key="option.value"
              type="button"
              @click="selectAbcClassification(option.value, $event)"
              class="sap-crm-btn sap-crm-btn--toggle sap-crm-btn--sm"
              :class="`sap-crm-btn--toggle--${option.color}`"
              :style="{ opacity: editValue === option.value ? 1 : 0.5 }">
              {{ option.label }}
            </button>
          </div>
        </template>
        <template v-else>
          <button
            v-if="getAbcLabel(account.abcClassificationDescription)"
            type="button"
            class="sap-crm-btn sap-crm-btn--toggle sap-crm-btn--sm"
            :class="`sap-crm-btn--toggle--${getAbcColor(account.abcClassificationDescription)}`"
            disabled
            style="cursor: default; opacity: 1;">
            {{ getAbcLabel(account.abcClassificationDescription) }}
          </button>
          <SapButton
            v-if="getAbcLabel(account.abcClassificationDescription)"
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('abcClassification', $event)"
            :aria-label="`Edit ABC classification`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Status (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'status'">
          <SapSelect
            v-model="editValue"
            :options="statusOptions"
            @blur="saveEdit"
            @update:model-value="saveEdit"
            style="min-width: 140px;"
          />
        </template>
        <template v-else>
          <span>{{ account.status }}</span>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('status', $event)"
            :aria-label="`Edit status`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Contact Person (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'primaryContactId'">
          <SapSelect
            v-model="editValue"
            :options="contactOptions"
            @blur="saveEdit"
            @update:model-value="saveEdit"
            style="min-width: 180px;"
          />
        </template>
        <template v-else>
          <span 
            v-if="account.primaryContactId"
            class="sap-crm-table__nav-link" 
            @click.stop="navigateToCrm('mdcontact', account.primaryContactId)">
            {{ account.contactPerson }}
          </span>
          <span v-else>{{ account.contactPerson }}</span>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('primaryContactId', $event)"
            :aria-label="`Edit contact person`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Owner (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'ownerId'">
          <SapSelect
            v-model="editValue"
            :options="ownerOptions"
            @blur="saveEdit"
            @update:model-value="saveEdit"
            style="min-width: 180px;"
          />
        </template>
        <template v-else>
          <span 
            v-if="account.ownerId"
            class="sap-crm-table__nav-link" 
            @click.stop="navigateToCrm('mdemployee', account.ownerId)">
            {{ account.owner }}
          </span>
          <span v-else>{{ account.owner }}</span>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('ownerId', $event)"
            :aria-label="`Edit owner`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Website (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'website'">
          <SapInput
            v-model="editValue"
            type="url"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            @keyup.escape="cancelEdit"
            style="flex: 1; min-width: 150px;"
          />
        </template>
        <template v-else>
          <a v-if="account.website" :href="account.website" target="_blank" rel="noopener noreferrer">
            {{ account.website }}
          </a>
          <span v-else>-</span>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('website', $event)"
            :aria-label="`Edit website`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Industry (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'industry'">
          <SapSelect
            v-model="editValue"
            :options="industryOptions"
            @blur="saveEdit"
            @update:model-value="saveEdit"
            style="min-width: 150px;"
          />
        </template>
        <template v-else>
          <span>{{ account.industry }}</span>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('industry', $event)"
            :aria-label="`Edit industry`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Country (editable) -->
    <td class="sap-crm-table__cell editable-cell">
      <div class="cell-content">
        <template v-if="editingField === 'country'">
          <SapSelect
            v-model="editValue"
            :options="countryOptions"
            @blur="saveEdit"
            @update:model-value="saveEdit"
            style="min-width: 180px;"
          />
        </template>
        <template v-else>
          <span>{{ account.country }}</span>
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            class="cell-edit-icon"
            @click="startEditing('country', $event)"
            :aria-label="`Edit country`">
            <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z"></path>
              </svg>
            </div>
          </SapButton>
        </template>
      </div>
    </td>
    
    <!-- Delete (non-editable) -->
    <td class="sap-crm-table__cell" style="text-align: center;">
      <SapButton
        variant="secondary"
        size="md"
        icon-only
        @click="handleDelete"
        aria-label="Delete account">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--only" style="fill: currentColor;">
          <path d="M14.0046,2 C15.6615,2 17.0046,3.34315 17.0046,5 L17.004,6 L20,6 C20.5523,6 21,6.44772 21,7 C21,7.55228 20.5523,8 20,8 L19,8 L19,19 C19,20.6569 17.6569,22 16,22 L8,22 C6.34315,22 5,20.6569 5,19 L5,8 L4,8 C3.44772,8 3,7.55228 3,7 C3,6.44772 3.44772,6 4,6 L6.999,6 L7,5 C7,3.34315 8.34315,2 10,2 L14.0046,2 Z M17,8 L7,8 L7,19 C7,19.5523 7.44772,20 8,20 L16,20 C16.5523,20 17,19.5523 17,19 L17,8 Z M10,10 C10.5523,10 11,10.4477 11,11 L11,17 C11,17.5523 10.5523,18 10,18 C9.44772,18 9,17.5523 9,17 L9,11 C9,10.4477 9.44772,10 10,10 Z M14,10 C14.5523,10 15,10.4477 15,11 L15,17 C15,17.5523 14.5523,18 14,18 C13.4477,18 13,17.5523 13,17 L13,11 C13,10.4477 13.4477,10 14,10 Z M14.0046,4 L10,4 C9.44772,4 9,4.44772 9,5 L8.999,6 L15.004,6 L15.0046,5 C15.0046,4.44772 14.5569,4 14.0046,4 Z"></path>
        </svg>
      </SapButton>
    </td>
  </tr>
</template>
<style scoped>
.edit-icon-btn {
  display: inline-flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.sap-crm-table__row:hover .edit-icon-btn {
  opacity: 1;
}

/* Inline editing styles */
.editable-cell {
  position: relative;
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2rem;
}

.cell-edit-icon {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  flex-shrink: 0;
}

.editable-cell:hover .cell-edit-icon {
  opacity: 1;
  visibility: visible;
}
</style>