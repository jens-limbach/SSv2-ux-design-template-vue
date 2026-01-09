<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useAccountStore } from '@/stores/useAccountStore'
import { useTableSort } from '@/composables/useTableSort'
import { useColumnFilter } from '@/composables/useColumnFilter'
import { useModal } from '@/composables/useModal'
import type { Account } from '@/types'
import SapTable from '@/components/SapTable.vue'
import SapSearchBox from '@/components/SapSearchBox.vue'
import SapButton from '@/components/SapButton.vue'
import SapIcon from '@/components/SapIcon.vue'
import SapColumnFilters from '@/components/SapColumnFilters.vue'
import SapFilterPill from '@/components/SapFilterPill.vue'
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

// Search term for server-side search
const searchTerm = ref('')

// Column filter configuration
const filterConfigs = [
  { key: 'status', label: 'Status', apiField: 'lifeCycleStatus', type: 'multi' as const },
  { key: 'country', label: 'Country', apiField: 'defaultAddress/country', type: 'multi' as const },
  { key: 'abcClass', label: 'ABC Classification', apiField: 'customerABCClassification', type: 'multi' as const },
  { key: 'industry', label: 'Industry', apiField: 'industrialSector', type: 'multi' as const }
]

// Initialize column filters
const {
  activeFilters,
  syncFromUrl,
  buildODataFilter,
  removeFilter,
  clearFilters,
  getActiveFilterLabels
} = useColumnFilter(filterConfigs)

// Filter dropdown options (computed from store data)
const filterOptions = computed(() => {
  // Create code-to-description mappings
  
  // Status mapping: code -> description
  const statusMap = new Map<string, string>()
  accountStore.accounts.forEach(a => {
    if (a.statusCode && a.status) {
      statusMap.set(a.statusCode, a.status)
    }
  })
  // Ensure all known statuses are included
  statusMap.set('ACTIVE', 'Active')
  statusMap.set('IN_PREPARATION', 'In Preparation')
  statusMap.set('BLOCKED', 'Blocked')
  statusMap.set('OBSOLETE', 'Obsolete')
  
  // ABC Classification mapping: code -> description
  const abcMap = new Map<string, string>()
  accountStore.accounts.forEach(a => {
    if (a.abcClassification && a.abcClassificationDescription) {
      abcMap.set(a.abcClassification, a.abcClassificationDescription)
    }
  })
  
  // Industry mapping: code -> description
  const industryMap = new Map<string, string>()
  // Use accountStore.industries for complete mapping
  accountStore.industries.forEach(ind => {
    industryMap.set(ind.id, ind.description)
  })
  // Also include industries from current accounts
  accountStore.accounts.forEach(a => {
    if (a.industryCode && a.industry) {
      industryMap.set(a.industryCode, a.industry)
    }
  })
  
  // Countries - use analytics data for complete list (all countries, not just current page)
  const countries = [...new Set(accountStore.analyticsData.map(a => a.country).filter(c => c && c !== 'Unknown'))].sort()
  
  return [
    {
      key: 'status',
      label: 'Status',
      options: Array.from(statusMap.entries()).map(([code, desc]) => ({ 
        value: code, 
        label: desc 
      })).sort((a, b) => a.label.localeCompare(b.label))
    },
    {
      key: 'country',
      label: 'Country',
      options: countries.map(c => ({ value: c, label: c }))
    },
    {
      key: 'abcClass',
      label: 'ABC Classification',
      options: Array.from(abcMap.entries()).map(([code, desc]) => ({ 
        value: code, 
        label: desc 
      })).sort((a, b) => a.label.localeCompare(b.label))
    },
    {
      key: 'industry',
      label: 'Industry',
      options: Array.from(industryMap.entries()).map(([code, desc]) => ({ 
        value: code, 
        label: desc 
      })).sort((a, b) => a.label.localeCompare(b.label))
    }
  ]
})

// Active filter pills for display
const activeFilterPills = computed(() => getActiveFilterLabels())

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(30)

const totalPages = computed(() => {
  return Math.ceil(accountStore.totalCount / itemsPerPage.value)
})

// Fetch accounts with search and filters
const fetchAccountsWithFilters = async (
  page: number,
  perPage: number,
  search?: string,
  filterString?: string
) => {
  await accountStore.fetchAccounts(page, perPage, search, filterString)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for filter changes
watch(activeFilters, () => {
  currentPage.value = 1 // Reset to page 1 when filters change
  const filterString = buildODataFilter()
  fetchAccountsWithFilters(
    currentPage.value,
    itemsPerPage.value,
    searchTerm.value || undefined,
    filterString || undefined
  )
}, { deep: true })

// Debounced search (combines with active filters)
watchDebounced(
  searchTerm,
  (newSearchTerm) => {
    currentPage.value = 1
    const filterString = buildODataFilter()
    fetchAccountsWithFilters(
      currentPage.value,
      itemsPerPage.value,
      newSearchTerm || undefined,
      filterString || undefined
    )
  },
  { debounce: 300 }
)

// Pagination handler
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    const filterString = buildODataFilter()
    fetchAccountsWithFilters(
      currentPage.value,
      itemsPerPage.value,
      searchTerm.value || undefined,
      filterString || undefined
    )
  }
}

// Clear search (keep filters active)
const handleClearSearch = () => {
  searchTerm.value = ''
}

// Handle filter update
const handleFilterUpdate = (filters: Record<string, string[]>) => {
  activeFilters.value = filters
}

// Handle clear all filters
const handleClearAllFilters = () => {
  clearFilters()
}

// Handle remove individual filter pill
const handleRemoveFilterPill = (key: string) => {
  removeFilter(key)
}

// Client-side sorting (for current page only)
const { sortedItems, sortBy, sortColumn, sortDirection } = useTableSort(
  computed(() => accountStore.accounts)
)

// Display items
const displayItems = computed(() => sortedItems.value)

// Load accounts on mount
onMounted(async () => {
  // Sync filters from URL first
  syncFromUrl()
  
  // Fetch dropdown data
  await accountStore.fetchDropdownData()
  
  // Initial fetch with filters from URL
  const filterString = buildODataFilter()
  await fetchAccountsWithFilters(
    currentPage.value,
    itemsPerPage.value,
    undefined,
    filterString || undefined
  )
  
  // Start analytics fetch in background
  accountStore.fetchAnalyticsData()
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
const handleSaveAccount = async (account: Account) => {
  if (mode.value === 'create') {
    await accountStore.addAccount(account)
  } else {
    await accountStore.updateAccount(account.accountId, account)
  }
  closeModal()
  selectedAccount.value = null
  selectedAccountId.value = null
  
  // Refresh with current filters
  const filterString = buildODataFilter()
  await fetchAccountsWithFilters(
    currentPage.value,
    itemsPerPage.value,
    searchTerm.value || undefined,
    filterString || undefined
  )
}

// Handle delete account
const handleDeleteAccount = async (id: string) => {
  if (!confirm('Are you sure you want to delete this account?')) return
  
  try {
    await accountStore.deleteAccount(id)
    if (selectedAccountId.value === id) {
      selectedAccountId.value = null
    }
  } catch (error) {
    console.error('Failed to delete account:', error)
    alert('Failed to delete account. Please try again.')
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
    
    // Debounce to allow multiple field updates
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
    <!-- Filter Bar (at top) -->
    <SapColumnFilters
      :filters="filterOptions"
      :model-value="activeFilters"
      @update:model-value="handleFilterUpdate"
      @clear="handleClearAllFilters"
    />
    
    <!-- Active Filter Pills -->
    <div v-if="activeFilterPills.length > 0" class="filter-pills-container">
      <span class="filter-pills-label">Active Filters:</span>
      <SapFilterPill
        v-for="pill in activeFilterPills"
        :key="pill.key"
        :label="pill.label"
        @remove="handleRemoveFilterPill(pill.key)"
      />
      <SapButton
        variant="neutrallight"
        size="md"
        class="clear-all-filters-btn"
        @click="handleClearAllFilters"
      >
        CLEAR ALL
      </SapButton>
    </div>
    
    <!-- Table Header -->
    <div class="table-header">
      <h1>Accounts ({{ accountStore.totalCount.toLocaleString() }})</h1>
      <div class="table-header__actions">
        <SapSearchBox v-model="searchTerm" @clear="handleClearSearch" />
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
    
    <!-- Pagination & CSS Guide Link -->
    <div v-if="!accountStore.loading && !accountStore.error && accountStore.totalCount > 0" 
         style="display: flex; justify-content: space-between; align-items: center;">
      <a 
        href="/css-showcase.html" 
        target="_blank"
        style="font-size: 0.625rem; color: var(--sap-crm-text-secondary); text-decoration: none; opacity: 0.7; padding-left: 1rem;"
        title="Open CSS Design System Showcase">
        CSS Design Guide
      </a>
      <SapPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="goToPage"
      />
    </div>
    
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
