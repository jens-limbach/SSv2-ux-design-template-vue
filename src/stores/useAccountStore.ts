import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, IndustryOption, ContactOption, EmployeeOption } from '@/types'
import * as api from '@/services/api'

export const useAccountStore = defineStore('account', () => {
  // State
  const accounts = ref<Account[]>([])
  const totalCount = ref(0)
  const analyticsData = ref<{ industry: string; priority: string; country: string }[]>([])
  const industries = ref<IndustryOption[]>([])
  const contacts = ref<ContactOption[]>([])
  const employees = ref<EmployeeOption[]>([])
  
  const loading = ref(false)
  const updating = ref(false)
  const loadingAnalytics = ref(false)
  const loadingIndustries = ref(false)
  const loadingContacts = ref(false)
  const loadingEmployees = ref(false)
  
  const error = ref<string | null>(null)
  const errorAnalytics = ref<string | null>(null)
  const errorIndustries = ref<string | null>(null)
  const errorContacts = ref<string | null>(null)
  const errorEmployees = ref<string | null>(null)

  // Update queue to prevent race conditions with If-Match header
  const updateQueue = new Map<string, Promise<void>>()

  // Getters
  const activeAccounts = computed(() =>
    accounts.value.filter(a => a.status === 'Active')
  )

  const accountsCount = computed(() => accounts.value.length)

  // Actions

  /**
   * Fetches all accounts from API with pagination support
   * @param page - Current page number (1-indexed)
   * @param itemsPerPage - Number of items per page
   * @param search - Optional search term for server-side search
   * @param filter - Optional OData filter string for server-side filtering
   */
  async function fetchAccounts(page: number = 1, itemsPerPage: number = 30, search?: string, filter?: string) {
    loading.value = true
    error.value = null
    try {
      const skip = (page - 1) * itemsPerPage
      const result = await api.fetchAccounts({
        top: itemsPerPage,
        skip: skip,
        orderby: 'formattedName asc',
        search: search,
        filter: filter
      })
      accounts.value = result.accounts
      totalCount.value = result.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch accounts'
      console.error('Error fetching accounts:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetches minimal analytics data in background (non-blocking)
   * Uses $select for ~90% smaller payload
   */
  async function fetchAnalyticsData() {
    loadingAnalytics.value = true
    errorAnalytics.value = null
    try {
      analyticsData.value = await api.fetchAccountsForAnalytics()
    } catch (e) {
      errorAnalytics.value = e instanceof Error ? e.message : 'Failed to fetch analytics'
      console.error('Error fetching analytics:', e)
    } finally {
      loadingAnalytics.value = false
    }
  }

  /**
   * Fetches industrial sectors for Industry dropdown
   */
  async function fetchIndustries() {
    loadingIndustries.value = true
    errorIndustries.value = null
    try {
      industries.value = await api.fetchIndustrialSectors()
    } catch (e) {
      errorIndustries.value = e instanceof Error ? e.message : 'Failed to fetch industries'
      console.error('Error fetching industries:', e)
    } finally {
      loadingIndustries.value = false
    }
  }

  /**
   * Fetches contact persons for Contact dropdown
   */
  async function fetchContacts() {
    loadingContacts.value = true
    errorContacts.value = null
    try {
      contacts.value = await api.fetchContacts()
    } catch (e) {
      errorContacts.value = e instanceof Error ? e.message : 'Failed to fetch contacts'
      console.error('Error fetching contacts:', e)
    } finally {
      loadingContacts.value = false
    }
  }

  /**
   * Fetches employees for Owner dropdown
   */
  async function fetchEmployees() {
    loadingEmployees.value = true
    errorEmployees.value = null
    try {
      employees.value = await api.fetchEmployees()
    } catch (e) {
      errorEmployees.value = e instanceof Error ? e.message : 'Failed to fetch employees'
      console.error('Error fetching employees:', e)
    } finally {
      loadingEmployees.value = false
    }
  }

  /**
   * Fetches all dropdown data sources (industries, contacts, employees)
   */
  async function fetchDropdownData() {
    await Promise.all([
      fetchIndustries(),
      fetchContacts(),
      fetchEmployees()
    ])
  }

  /**
   * Fetches single account by ID with ETag (used before update to get If-Match header)
   */
  async function fetchSingleForUpdate(id: string): Promise<{ account: Account; etag: string }> {
    try {
      return await api.fetchAccountByIdWithETag(id)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to fetch account'
      console.error('Error fetching single account:', e)
      throw new Error(message)
    }
  }

  /**
   * Adds a new account
   */
  async function addAccount(account: Partial<Account>) {
    loading.value = true
    error.value = null
    try {
      const newAccount = await api.createAccount(account)
      accounts.value.push(newAccount)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create account'
      console.error('Error creating account:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Updates an existing account
   * Uses a queue to ensure updates are sequential and prevent If-Match race conditions
   */
  async function updateAccount(accountId: string, updates: Partial<Account>) {
    // Wait for any pending update to this account to complete
    if (updateQueue.has(accountId)) {
      await updateQueue.get(accountId)
    }

    // Create promise for this update
    const updatePromise = (async () => {
      updating.value = true
      error.value = null
      try {
        // Find the account to get its UUID
        const account = accounts.value.find(a => a.accountId === accountId)
        if (!account) {
          throw new Error('Account not found')
        }

        // Fetch fresh account data to get latest updatedOn timestamp for If-Match header
        const { etag } = await fetchSingleForUpdate(account.id)

        // Update via API with fresh etag
        const updatedAccount = await api.updateAccount(account.id, updates, etag)
        
        // Update local state
        const index = accounts.value.findIndex(a => a.accountId === accountId)
        if (index !== -1) {
          accounts.value[index] = updatedAccount
        }
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to update account'
        console.error('Error updating account:', e)
        throw e
      } finally {
        updating.value = false
        // Remove from queue after completion
        updateQueue.delete(accountId)
      }
    })()

    // Add to queue
    updateQueue.set(accountId, updatePromise)

    // Wait for this update to complete
    await updatePromise
  }

  /**
   * Deletes an account
   */
  async function deleteAccount(accountId: string) {
    loading.value = true
    error.value = null
    try {
      // Find the account to get its UUID
      const account = accounts.value.find(a => a.accountId === accountId)
      if (!account) {
        throw new Error('Account not found')
      }

      // Delete via API
      await api.deleteAccount(account.id)
      
      // Remove from local state
      accounts.value = accounts.value.filter(a => a.accountId !== accountId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete account'
      console.error('Error deleting account:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Gets an account by ID
   */
  function getAccountById(accountId: string): Account | undefined {
    return accounts.value.find(a => a.accountId === accountId)
  }

  return {
    // State
    accounts,
    totalCount,
    analyticsData,
    industries,
    contacts,
    employees,
    loading,
    updating,
    loadingAnalytics,
    loadingIndustries,
    loadingContacts,
    loadingEmployees,
    error,
    errorAnalytics,
    errorIndustries,
    errorContacts,
    errorEmployees,
    // Getters
    activeAccounts,
    accountsCount,
    // Actions
    fetchAccounts,
    fetchAnalyticsData,
    fetchIndustries,
    fetchContacts,
    fetchEmployees,
    fetchDropdownData,
    fetchSingleForUpdate,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountById
  }
})
