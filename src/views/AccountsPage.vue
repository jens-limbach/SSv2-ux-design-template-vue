<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAccountStore } from '@/stores/useAccountStore'
import { useTableSort } from '@/composables/useTableSort'
import { useSearch } from '@/composables/useSearch'
import { useModal } from '@/composables/useModal'
import type { Account } from '@/types'
import SapTable from '@/components/SapTable.vue'
import SapSearchBox from '@/components/SapSearchBox.vue'
import SapButton from '@/components/SapButton.vue'
import SapIcon from '@/components/SapIcon.vue'
import AccountModal from '@/components/AccountModal.vue'
import SapPagination from '@/components/SapPagination.vue'
import AnalyticsPanel from '@/components/AnalyticsPanel.vue'

const accountStore = useAccountStore()
const { isOpen, mode, openCreateModal, openEditModal, closeModal } = useModal()

// Analytics toggle
const showAnalytics = ref(false)

const toggleAnalytics = () => {
  showAnalytics.value = !showAnalytics.value
}

// Selected account for editing
const selectedAccount = ref<Account | null>(null)
const selectedAccountId = ref<string | null>(null)

// URL query parameter filters
const urlFilters = ref<Record<string, string>>({})

// Parse URL query parameters
const parseUrlFilters = () => {
  const params = new URLSearchParams(window.location.search)
  const filters: Record<string, string> = {}
  
  params.forEach((value, key) => {
    // Normalize key to match Account property names (case-insensitive)
    const normalizedKey = key.toLowerCase()
    filters[normalizedKey] = value
  })
  
  urlFilters.value = filters
}

// Search functionality (updated to exclude removed fields)
const searchKeys: (keyof Account)[] = [
  'accountId',
  'companyName',
  'contactPerson',
  'owner',
  'website',
  'industry',
  'country',
  'abcClassificationDescription',
  'status'
]

const { searchTerm, filteredItems: searchFilteredItems } = useSearch(
  computed(() => accountStore.accounts),
  searchKeys
)

// Apply URL query parameter filters
const urlFilteredItems = computed(() => {
  if (Object.keys(urlFilters.value).length === 0) {
    return searchFilteredItems.value
  }
  
  return searchFilteredItems.value.filter(account => {
    return Object.entries(urlFilters.value).every(([key, value]) => {
      // Find matching property (case-insensitive)
      const accountKey = Object.keys(account).find(
        k => k.toLowerCase() === key
      ) as keyof Account | undefined
      
      if (!accountKey) return true // Skip unknown properties
      
      const accountValue = account[accountKey]
      
      // Handle different value types
      if (typeof accountValue === 'boolean') {
        return accountValue.toString().toLowerCase() === value.toLowerCase()
      }
      
      // Case-insensitive string comparison
      return String(accountValue).toLowerCase() === value.toLowerCase()
    })
  })
})

// Sorting functionality
const { sortedItems, sortBy, sortColumn, sortDirection } = useTableSort(urlFilteredItems)

// Pagination - calculate based on API totalCount
const itemsPerPage = 30
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(accountStore.totalCount / itemsPerPage)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Watch currentPage and fetch new data from API
watch(currentPage, (newPage) => {
  accountStore.fetchAccounts(newPage, itemsPerPage)
  // Scroll to top when page changes
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Display items (filtered and sorted, all items from current API fetch)
const displayItems = computed(() => sortedItems.value)

// Load accounts on mount and parse URL filters
onMounted(async () => {
  // Fetch dropdown data first (industries, contacts, employees)
  await accountStore.fetchDropdownData()
  
  // Then fetch accounts for table (page 1)
  await accountStore.fetchAccounts(currentPage.value, itemsPerPage)
  
  // Start analytics fetch in background (non-blocking, don't await)
  // By the time user clicks analytics button, data will likely be ready
  accountStore.fetchAnalyticsData()
  
  parseUrlFilters()
  
  // Listen for URL changes (e.g., back/forward navigation)
  window.addEventListener('popstate', parseUrlFilters)
})

// Cleanup event listener
onUnmounted(() => {
  window.removeEventListener('popstate', parseUrlFilters)
})

// Handle add new account
const handleAddAccount = () => {
  selectedAccount.value = null
  selectedAccountId.value = null
  openCreateModal()
}

// Handle edit account (row click)
const handleRowClick = (account: Account) => {
  selectedAccount.value = account
  selectedAccountId.value = account.accountId
  openEditModal()
}

// Handle save account (create or update)
const handleSaveAccount = (account: Account) => {
  if (mode.value === 'create') {
    accountStore.addAccount(account)
  } else {
    accountStore.updateAccount(account.accountId, account)
  }
  closeModal()
  selectedAccount.value = null
  selectedAccountId.value = null
}

// Handle delete account
const handleDeleteAccount = (id: string) => {
  accountStore.deleteAccount(id)
  if (selectedAccountId.value === id) {
    selectedAccountId.value = null
  }
}

// Store for accumulating multiple field updates from inline editing
const pendingUpdates = new Map<string, Partial<Account>>()

// Handle inline field update
const handleFieldUpdate = async (accountId: string, field: keyof Account, value: any) => {
  try {
    console.log('[Field Update] Account:', accountId, 'Field:', field, 'Value:', value)
    
    // Accumulate updates for the same account
    if (!pendingUpdates.has(accountId)) {
      pendingUpdates.set(accountId, {})
    }
    const updates = pendingUpdates.get(accountId)!
    updates[field] = value
    
    console.log('[Field Update] Accumulated updates:', updates)
    
    // Debounce to allow multiple field updates (e.g., industry code + description)
    // Increased to 150ms to reduce SAP backend lock conflicts
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // Check if still the latest update for this account
    if (pendingUpdates.get(accountId) === updates) {
      console.log('[Field Update] Sending to store:', updates)
      await accountStore.updateAccount(accountId, updates)
      pendingUpdates.delete(accountId)
    }
  } catch (error) {
    console.error('Failed to update field:', error)
    pendingUpdates.delete(accountId)
    // Optionally show error to user
  }
}

// Handle modal close
const handleCloseModal = () => {
  closeModal()
  selectedAccount.value = null
  selectedAccountId.value = null
}
</script>

<template>
  <div class="table-container">
    <!-- Table Header -->
    <div class="table-header">
      <h1>Accounts ({{ accountStore.totalCount }})</h1>
      <div class="table-header__actions">
        <SapSearchBox v-model="searchTerm" />
        <SapButton
          variant="secondary"
          size="md"
          icon-only
          @click="toggleAnalytics"
          :aria-label="showAnalytics ? 'Hide analytics' : 'Show analytics'">
          <SapIcon type="analytics" size="md" />
        </SapButton>
        <SapButton
          variant="secondary"
          size="md"
          icon-only
          @click="handleAddAccount"
          aria-label="Add new account">
          <SapIcon type="plus" size="md" />
        </SapButton>
      </div>
    </div>
    
    <!-- Analytics Panel -->
    <div v-if="showAnalytics">
      <!-- Show loading only if still fetching analytics -->
      <div v-if="accountStore.loadingAnalytics" 
           style="padding: 2rem; text-align: center;">
        Loading analytics data...
      </div>
      
      <!-- Show error if analytics fetch failed -->
      <div v-else-if="accountStore.errorAnalytics" 
           style="padding: 2rem; text-align: center; color: var(--color-error-5);">
        {{ accountStore.errorAnalytics }}
      </div>
      
      <!-- Show charts when data ready -->
      <AnalyticsPanel 
        v-else
        :analytics-data="accountStore.analyticsData"
      />
    </div>
    
    <!-- Loading State -->
    <div v-if="accountStore.loading" style="padding: 2rem; text-align: center;">
      Loading accounts...
    </div>
    
    <!-- Error State -->
    <div v-else-if="accountStore.error" style="padding: 2rem; text-align: center; color: var(--color-error-5);">
      {{ accountStore.error }}
    </div>
    
    <!-- Table -->
    <SapTable
      v-else
      :accounts="displayItems"
      :sort-column="sortColumn"
      :sort-direction="sortDirection"
      :selected-account-id="selectedAccountId"
      @sort="sortBy"
      @row-click="handleRowClick"
      @delete="handleDeleteAccount"
      @update="handleFieldUpdate"
    />
    
    <!-- Pagination -->
    <SapPagination
      v-if="!accountStore.loading && !accountStore.error && totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:current-page="goToPage"
    />
    
    <!-- Account Modal (Create/Edit) -->
    <AccountModal
      :is-open="isOpen"
      :mode="mode"
      :account="selectedAccount"
      @close="handleCloseModal"
      @save="handleSaveAccount"
    />
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
/* Most styling comes from sap-crm-components.css */
</style>
