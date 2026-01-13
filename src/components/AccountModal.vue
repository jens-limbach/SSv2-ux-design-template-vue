<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import type { Account, Status } from '@/types'
import { useAccountStore } from '@/stores/useAccountStore'
import SapButton from './SapButton.vue'
import SapInput from './SapInput.vue'
import SapSwitch from './SapSwitch.vue'
import SapRadioGroup from './SapRadioGroup.vue'
import SapSelect from './SapSelect.vue'
import SapIcon from './SapIcon.vue'

interface Props {
  isOpen: boolean
  mode?: 'create' | 'edit'
  account?: Account | null
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  account: null
})

const emit = defineEmits<{
  close: []
  save: [account: Account]
}>()

const accountStore = useAccountStore()

// Menu state
const isMenuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

// Toggle menu
const toggleMenu = (event: Event) => {
  event.stopPropagation()
  isMenuOpen.value = !isMenuOpen.value
}

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (!isMenuOpen.value) return
  
  const target = event.target as HTMLElement
  
  // Check if the click is outside the menu container
  if (menuRef.value && !menuRef.value.contains(target)) {
    isMenuOpen.value = false
  }
}

// Navigation functions using window.postMessage for SAP CRM integration
const openAccountDetails = () => {
  if (!props.account?.id) return
  
  const message = {
    operation: 'navigation',
    params: {
      objectKey: props.account.id,
      routingKey: 'mdaccount',
      viewType: 'details'
    }
  }
  window.parent.postMessage(message, '*')
  isMenuOpen.value = false
}

const createOpportunity = () => {
  if (!props.account?.id) return
  
  const message = {
    operation: 'navigation',
    params: {
      routingKey: 'guidedselling',
      viewType: 'quickcreate',
      attributes: `[{"name":"account","value":{"id":"${props.account.id}"}}]`
    }
  }
  window.parent.postMessage(message, '*')
  isMenuOpen.value = false
}

const createQuote = () => {
  if (!props.account?.id) return
  
  const message = {
    operation: 'navigation',
    params: {
      routingKey: 'sales-quote',
      viewType: 'quickcreate',
      attributes: `[{"name":"partyDetails","value":{"account":{"id":"${props.account.id}"}}}]`
    }
  }
  window.parent.postMessage(message, '*')
  isMenuOpen.value = false
}

const createCase = () => {
  if (!props.account?.id) return
  
  const message = {
    operation: 'navigation',
    params: {
      routingKey: 'case',
      viewType: 'quickcreate',
      attributes: `[{"name":"partyDetails","value":{"account":{"id":"${props.account.id}"}}}]`
    }
  }
  window.parent.postMessage(message, '*')
  isMenuOpen.value = false
}

// Setup click-outside listener
onMounted(() => {
  // Use mousedown for more reliable outside click detection
  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside)
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// Form data
const form = ref<Partial<Account>>({
  accountId: '',
  id: '',
  companyName: '',
  contactPerson: '',
  primaryContactId: '',
  owner: '',
  ownerId: '',
  website: '',
  industry: '',
  country: 'US',
  prospect: true,
  abcClassification: 'B',
  abcClassificationDescription: 'Customer ABC Classification B',
  status: 'Active' as Status
})

// Store original values for edit mode (to track changes)
const originalForm = ref<Partial<Account>>({})

// Country options (ISO 2-letter codes)
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

// Status options
const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'In Preparation', label: 'In Preparation' },
  { value: 'Blocked', label: 'Blocked' },
  { value: 'Obsolete', label: 'Obsolete' }
]

// Computed options from store
const industryOptions = computed(() => 
  accountStore.industries.map(ind => ({ value: ind.id, label: ind.description }))
)

// Handle industry selection - store both code and description
const handleIndustryChange = (code: string) => {
  console.log('[AccountModal] handleIndustryChange called with code:', code)
  console.log('[AccountModal] Available industries:', accountStore.industries)
  const industry = accountStore.industries.find(ind => ind.id === code)
  console.log('[AccountModal] Found industry:', industry)
  if (industry) {
    console.log('[AccountModal] Setting industryCode to:', code)
    console.log('[AccountModal] Setting industry to:', industry.description)
    form.value.industryCode = code
    form.value.industry = industry.description
    console.log('[AccountModal] After setting - form.industryCode:', form.value.industryCode)
    console.log('[AccountModal] After setting - form.industry:', form.value.industry)
  }
}

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

// ABC Classification options (Account A, B, C)
const abcOptions = [
  { value: 'A', label: 'Account A', description: 'Customer ABC Classification A', color: 'red' },
  { value: 'B', label: 'Account B', description: 'Customer ABC Classification B', color: 'blue' },
  { value: 'C', label: 'Account C', description: 'Customer ABC Classification C', color: 'yellow' }
]

const selectAbcClassification = (value: string) => {
  const option = abcOptions.find(opt => opt.value === value)
  if (option) {
    form.value.abcClassification = value
    form.value.abcClassificationDescription = option.description
  }
}

// Watch for account changes (edit mode)
watch(() => props.account, (newAccount) => {
  if (newAccount && props.mode === 'edit') {
    form.value = { ...newAccount }
    originalForm.value = { ...newAccount } // Store original values
  }
}, { immediate: true })

// Reset form and menu when modal closes or opens
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    setTimeout(() => {
      resetForm()
      isMenuOpen.value = false
    }, 300)
  } else {
    // Reset menu state when modal opens
    isMenuOpen.value = false
    if (props.mode === 'create') {
      resetForm()
    }
  }
})

const resetForm = () => {
  form.value = {
    accountId: '',
    id: '',
    companyName: '',
    contactPerson: '',
    primaryContactId: '',
    owner: '',
    ownerId: '',
    website: '',
    industry: '',
    industryCode: '',
    country: 'US',
    prospect: true,
    abcClassification: 'B',
    abcClassificationDescription: 'Customer ABC Classification B',
    status: 'Active' as Status
  }
}

const modalTitle = computed(() => {
  return props.mode === 'create' ? 'Add New Account' : 'Edit Account'
})

const handleSubmit = (event: Event) => {
  event.preventDefault()
  const formElement = event.target as HTMLFormElement
  
  if (!formElement.checkValidity()) {
    formElement.reportValidity()
    return
  }
  
  // In edit mode, only send changed fields
  if (props.mode === 'edit') {
    const changes: Partial<Account> = {}
    
    // Always include accountId and id for identification
    changes.accountId = form.value.accountId
    changes.id = form.value.id
    
    // Fields to exclude from update payload (display-only or read-only fields)
    const excludedFields = new Set([
      'industry', // Description field (display only) - send industryCode instead
      'abcClassificationDescription', // Description field (display only)
      'contactPerson', // Display name - send primaryContactId instead
      'owner', // Display name - send ownerId instead
      'accountId', // Display ID - read-only
      'updatedOn' // Metadata - read-only
    ])
    
    // Compare each field and only include changed values
    for (const key in form.value) {
      const formKey = key as keyof Account
      if (!excludedFields.has(formKey) && form.value[formKey] !== originalForm.value[formKey]) {
        console.log(`[AccountModal] Change detected in ${formKey}:`, form.value[formKey], '(was:', originalForm.value[formKey], ')')
        changes[formKey] = form.value[formKey] as any
      }
    }
    
    console.log('[AccountModal] Final changes object:', changes)
    emit('save', changes as Account)
  } else {
    // In create mode, send all fields
    emit('save', form.value as Account)
  }
  
  emit('close')
}

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <div 
    v-if="isOpen"
    class="modal-backdrop active"
    @click="handleBackdropClick">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ modalTitle }}</h2>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <!-- Meatballs menu button (only in edit mode) -->
          <div v-if="mode === 'edit' && account" class="sap-crm-modal-menu__button-wrapper">
            <SapButton
              ref="menuButtonRef"
              variant="secondary"
              size="md"
              icon-only
              @click="toggleMenu">
              <SapIcon type="meatballs" size="md" />
            </SapButton>
            
            <!-- Dropdown menu -->
            <div v-if="isMenuOpen" ref="menuRef" class="sap-crm-modal-menu" @click.stop>
              <div class="sap-crm-modal-menu__item" @click="openAccountDetails">
                Open Account Details
              </div>
              <div class="sap-crm-modal-menu__item" @click="createOpportunity">
                Create Opportunity
              </div>
              <div class="sap-crm-modal-menu__item" @click="createQuote">
                Create Quote
              </div>
              <div class="sap-crm-modal-menu__item" @click="createCase">
                Create Case
              </div>
            </div>
          </div>
          
          <!-- Close button -->
          <SapButton
            variant="secondary"
            size="md"
            icon-only
            @click="handleClose">
            <SapIcon type="close" size="md" />
          </SapButton>
        </div>
      </div>
      
      <div class="modal-body">
        <form id="accountForm" @submit="handleSubmit">
          <!-- Account ID (optional in create mode) -->
          <div v-if="mode === 'edit'" class="form-row">
            <label for="accountId">Account ID</label>
            <SapInput
              id="accountId"
              v-model="form.accountId!"
              type="text"
              placeholder="ACC-0000"
              :disabled="true"
            />
          </div>
          
          <!-- Company Name -->
          <div class="form-row">
            <label for="companyName">Company Name *</label>
            <SapInput
              id="companyName"
              v-model="form.companyName!"
              type="text"
              placeholder="Enter company name"
              :required="true"
            />
          </div>
          
          <!-- Prospect Toggle -->
          <div class="form-row-inline">
            <label for="prospect">Prospect</label>
            <SapSwitch
              id="prospect"
              v-model="form.prospect!"
            />
          </div>
          
          <!-- ABC Classification -->
          <div class="form-row">
            <label>ABC Classification *</label>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              <button
                v-for="option in abcOptions"
                :key="option.value"
                type="button"
                @click="selectAbcClassification(option.value)"
                class="sap-crm-btn sap-crm-btn--toggle sap-crm-btn--sm"
                :class="`sap-crm-btn--toggle--${option.color}`"
                :style="{ opacity: form.abcClassification === option.value ? 1 : 0.5 }">
                {{ option.label }}
              </button>
            </div>
          </div>
          
          <!-- Status -->
          <div class="form-row">
            <label>Status *</label>
            <SapRadioGroup
              v-model="form.status!"
              name="status"
              :options="statusOptions"
            />
          </div>
          
          <!-- Contact Person -->
          <div class="form-row">
            <label for="contactPerson">Contact Person *</label>
            <SapSelect
              id="contactPerson"
              v-model="form.primaryContactId!"
              :options="contactOptions"
              :required="true"
              @update:model-value="(value) => {
                const contact = accountStore.contacts.find(c => c.id === value)
                if (contact) form.contactPerson = contact.formattedName
              }"
            />
          </div>
          
          <!-- Owner -->
          <div class="form-row">
            <label for="owner">Owner *</label>
            <SapSelect
              id="owner"
              v-model="form.ownerId!"
              :options="ownerOptions"
              :required="true"
              @update:model-value="(value) => {
                const employee = accountStore.employees.find(e => e.id === value)
                if (employee) form.owner = employee.formattedName
              }"
            />
          </div>
          
          <!-- Website -->
          <div class="form-row">
            <label for="website">Website</label>
            <SapInput
              id="website"
              v-model="form.website!"
              type="url"
              placeholder="https://www.example.com"
            />
          </div>
          
          <!-- Industry -->
          <div class="form-row">
            <label for="industry">Industry *</label>
            <SapSelect
              id="industry"
              v-model="form.industryCode!"
              :options="industryOptions"
              :required="true"
              @update:modelValue="handleIndustryChange"
            />
          </div>
          
          <!-- Country -->
          <div class="form-row">
            <label for="country">Country *</label>
            <SapSelect
              id="country"
              v-model="form.country!"
              :options="countryOptions"
              :required="true"
            />
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <SapButton
          variant="secondary"
          @click="handleClose">
          Cancel
        </SapButton>
        <SapButton
          variant="primary"
          type="submit"
          form="accountForm">
          {{ mode === 'create' ? 'Add Account' : 'Save Changes' }}
        </SapButton>
      </div>
    </div>
  </div>
</template>
