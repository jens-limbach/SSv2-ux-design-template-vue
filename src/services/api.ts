import type { Account, IndustryOption, ContactOption, EmployeeOption } from '@/types'

// API Base URL (configured via Vite proxy in development)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// API Response types
interface ApiAccount {
  id: string
  displayId: string
  formattedName: string
  isProspect: boolean
  customerABCClassification: string
  customerABCClassificationDescription: string
  lifeCycleStatus: string // Code (e.g., 'ACTIVE', 'IN_PREPARATION')
  lifeCycleStatusDescription: string
  primaryContactId: string
  primaryContactformattedName: string
  ownerId: string
  ownerFormattedName: string
  industrialSector?: string // Code at root level
  industrialSectorDescription?: string // Description at root level
  defaultCommunication?: {
    web?: string
  }
  defaultAddress?: {
    country?: string
  }
  adminData?: {
    updatedOn?: string
  }
}

interface ApiListResponse<T> {
  value: T[]
  count?: number
}

interface ApiSingleResponse<T> {
  value: T
}

interface ApiIndustrialSector {
  id: string
  code: string
  description: string
}

interface ApiContact {
  id: string
  displayId: string
  formattedName: string
}

interface ApiEmployee {
  id: string
  displayId: string
  formattedName: string
}

// ===========================
// Mapper Functions
// ===========================

/**
 * Core mapper: Transforms API account structure to frontend Account model
 */
export function mapAccountFromApi(apiAccount: ApiAccount): Account {
  return {
    accountId: apiAccount.displayId || '',
    id: apiAccount.id || '',
    companyName: apiAccount.formattedName || '',
    contactPerson: apiAccount.primaryContactformattedName || '',
    primaryContactId: apiAccount.primaryContactId || '',
    owner: apiAccount.ownerFormattedName || '',
    ownerId: apiAccount.ownerId || '',
    website: apiAccount.defaultCommunication?.web || '',
    industry: apiAccount.industrialSectorDescription || '',
    industryCode: apiAccount.industrialSector || '',
    country: apiAccount.defaultAddress?.country || '',
    prospect: apiAccount.isProspect || false,
    abcClassification: apiAccount.customerABCClassification || '',
    abcClassificationDescription: apiAccount.customerABCClassificationDescription || '',
    status: mapStatusFromApi(apiAccount.lifeCycleStatusDescription),
    statusCode: apiAccount.lifeCycleStatus || '',
    updatedOn: apiAccount.adminData?.updatedOn
  }
}

/**
 * Maps single account response (unwraps {value: {...}})
 */
export function mapSingleResponse(response: ApiSingleResponse<ApiAccount>): Account {
  return mapAccountFromApi(response.value)
}

/**
 * Maps list response (unwraps {value: [...]})
 */
export function mapListResponse(response: ApiListResponse<ApiAccount>): Account[] {
  return response.value.map(mapAccountFromApi)
}

/**
 * Maps frontend Account to API structure for create/update
 */
export function mapAccountToApi(account: Partial<Account>, isUpdate = false) {
  // For updates (PATCH), only send fields that have actual values (not undefined or empty strings)
  if (isUpdate) {
    console.log('[Mapper] Input account for update:', account)
    console.log('[Mapper] industryCode:', account.industryCode)
    console.log('[Mapper] industry:', account.industry)
    
    const payload: any = {}
    
    if (account.companyName !== undefined && account.companyName !== '') {
      payload.firstLineName = account.companyName
      payload.formattedName = account.companyName
    }
    if (account.prospect !== undefined) {
      payload.isProspect = account.prospect
      payload.customerRole = account.prospect ? 'BUP002' : 'CRM000'
    }
    if (account.abcClassification !== undefined && account.abcClassification !== '') {
      payload.customerABCClassification = account.abcClassification
    }
    if (account.status !== undefined) {
      payload.lifeCycleStatus = mapStatusToApi(account.status)
    }
    if (account.primaryContactId !== undefined && account.primaryContactId !== '') {
      payload.hasContactPersons = [
        {
          contactId: account.primaryContactId,
          isDefault: true
        }
      ]
    }
    if (account.ownerId !== undefined && account.ownerId !== '') {
      payload.ownerId = account.ownerId
    }
    if (account.website !== undefined && account.website !== '') {
      payload.defaultCommunication = { web: account.website }
    }
    // Industry code goes at root level, not in defaultCommunication
    if (account.industryCode !== undefined && account.industryCode !== '') {
      console.log('[Mapper] Setting industrialSector to:', account.industryCode)
      payload.industrialSector = account.industryCode
    }
    if (account.country !== undefined && account.country !== '') {
      payload.defaultAddress = { country: account.country }
    }
    
    console.log('[Mapper] Final payload:', payload)
    return payload
  }
  
  // For create (POST), send all fields
  const customerRole = account.prospect ? 'BUP002' : 'CRM000'
  
  const payload: any = {
    firstLineName: account.companyName, // Company name goes to firstLineName
    formattedName: account.companyName, // Also keep formattedName for compatibility
    isProspect: account.prospect,
    customerRole: customerRole, // Mandatory field
    customerABCClassification: account.abcClassification,
    lifeCycleStatus: mapStatusToApi(account.status),
    ownerId: account.ownerId,
    defaultCommunication: {
      web: account.website
    },
    defaultAddress: {
      country: account.country
    }
  }
  
  // Add contact person if provided
  if (account.primaryContactId && account.primaryContactId !== '') {
    payload.hasContactPersons = [
      {
        contactId: account.primaryContactId,
        isDefault: true
      }
    ]
  }
  
  // Only include industrialSector if code is provided
  if (account.industryCode && account.industryCode !== '') {
    payload.industrialSector = account.industryCode
  }
  
  return payload
}

// Helper mapper for status
function mapStatusFromApi(apiStatus?: string): 'Active' | 'In Preparation' | 'Blocked' | 'Obsolete' {
  if (!apiStatus) return 'Active'
  const statusUpper = apiStatus.toUpperCase()
  if (statusUpper === 'ACTIVE') return 'Active'
  if (statusUpper === 'IN_PREPARATION') return 'In Preparation'
  if (statusUpper === 'BLOCKED') return 'Blocked'
  if (statusUpper === 'OBSOLETE') return 'Obsolete'
  return 'Active' // Default to Active for unknown statuses
}

function mapStatusToApi(status?: string): string {
  if (status === 'Active') return 'ACTIVE'
  if (status === 'In Preparation') return 'IN_PREPARATION'
  if (status === 'Blocked') return 'BLOCKED'
  if (status === 'Obsolete') return 'OBSOLETE'
  return 'ACTIVE' // Default to ACTIVE
}

// ===========================
// API Client Functions
// ===========================

/**
 * Fetches all accounts with optional OData parameters
 */
export async function fetchAccounts(params?: {
  top?: number
  skip?: number
  orderby?: string
  filter?: string
  search?: string
}): Promise<{ accounts: Account[], count: number }> {
  const queryParams = new URLSearchParams()
  
  if (params?.top) queryParams.append('$top', params.top.toString())
  if (params?.skip) queryParams.append('$skip', params.skip.toString())
  if (params?.orderby) queryParams.append('$orderby', params.orderby)
  if (params?.filter) queryParams.append('$filter', params.filter)
  if (params?.search) {
    // Escape double quotes in search term to prevent syntax errors
    const escapedSearch = params.search.replace(/"/g, '\\"')
    queryParams.append('$search', `"${escapedSearch}"`)
  }
  queryParams.append('$count', 'true')
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  
  const response = await fetch(`${API_BASE_URL}/accounts${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.statusText}`)
  }
  
  const data: ApiListResponse<ApiAccount> = await response.json()
  return {
    accounts: mapListResponse(data),
    count: data.count || 0
  }
}

/**
 * Fetches minimal account data for analytics (only fields needed for charts)
 * Uses $select to drastically reduce payload size (~90% reduction)
 * Fetches in batches due to API $top limit of 999
 */
export async function fetchAccountsForAnalytics(): Promise<{
  industry: string
  priority: string
  country: string
}[]> {
  const allData: { industry: string; priority: string; country: string }[] = []
  const batchSize = 999 // SAP CRM API limit
  let skip = 0
  let hasMore = true
  
  while (hasMore) {
    const queryParams = new URLSearchParams()
    
    // Only fetch fields needed for charts
    queryParams.append('$select', 'customerABCClassificationDescription,industrialSectorDescription,defaultAddress')
    queryParams.append('$top', batchSize.toString())
    queryParams.append('$skip', skip.toString())
    queryParams.append('$count', 'true')
    
    const queryString = `?${queryParams.toString()}`
    
    const response = await fetch(`${API_BASE_URL}/accounts${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics data: ${response.statusText}`)
    }
    
    const data: ApiListResponse<ApiAccount> = await response.json()
    
    // Debug: Log first account structure to see what we actually get
    if (data.value.length > 0 && skip === 0) {
      console.log('[Analytics Debug] First account structure:', JSON.stringify(data.value[0], null, 2))
    }
    
    // Map batch to minimal format
    const batchData = data.value.map(account => ({
      industry: account.industrialSectorDescription || 'Unknown',
      priority: account.customerABCClassificationDescription || 'Unknown',
      country: account.defaultAddress?.country || 'Unknown'
    }))
    
    allData.push(...batchData)
    
    // Check if there are more records
    const totalCount = data.count || 0
    skip += batchSize
    hasMore = skip < totalCount
  }
  
  return allData
}

/**
 * Fetches a single account by ID
 */
export async function fetchAccountById(id: string): Promise<Account> {
  const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch account: ${response.statusText}`)
  }
  
  const data: ApiSingleResponse<ApiAccount> = await response.json()
  return mapSingleResponse(data)
}

/**
 * Fetches a single account by ID with updatedOn timestamp for If-Match header
 */
export async function fetchAccountByIdWithETag(id: string): Promise<{ account: Account; etag: string }> {
  // Add cache-busting parameter to ensure fresh data
  const timestamp = new Date().getTime()
  const response = await fetch(`${API_BASE_URL}/accounts/${id}?_=${timestamp}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch account: ${response.statusText}`)
  }
  
  const data: ApiSingleResponse<ApiAccount> = await response.json()
  const account = mapSingleResponse(data)
  
  // SAP CRM uses the updatedOn timestamp as the If-Match value, not the HTTP ETag header
  if (!account.updatedOn) {
    throw new Error('No updatedOn timestamp found for If-Match header')
  }
  
  return {
    account,
    etag: account.updatedOn
  }
}

/**
 * Creates a new account
 */
export async function createAccount(account: Partial<Account>): Promise<Account> {
  const apiAccount = mapAccountToApi(account)
  
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(apiAccount)
  })
  
  if (!response.ok) {
    throw new Error(`Failed to create account: ${response.statusText}`)
  }
  
  const data: ApiSingleResponse<ApiAccount> = await response.json()
  return mapSingleResponse(data)
}

/**
 * Updates an existing account with retry logic for lock conflicts
 */
export async function updateAccount(id: string, account: Partial<Account>, ifMatch: string): Promise<Account> {
  const apiAccount = mapAccountToApi(account, true) // true = isUpdate
  
  const maxRetries = 3
  let retryCount = 0
  
  while (retryCount <= maxRetries) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'If-Match': ifMatch
        },
        body: JSON.stringify(apiAccount)
      })
      
      // Handle 423 Locked - retry with exponential backoff
      if (response.status === 423) {
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 500 // 500ms, 1s, 2s
          console.log(`[API] Account locked (423), retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          retryCount++
          continue
        }
        // Max retries reached
        throw new Error('Account is locked by another process. Please try again in a moment.')
      }
      
      if (!response.ok) {
        throw new Error(`Failed to update account: ${response.statusText}`)
      }
      
      const data: ApiSingleResponse<ApiAccount> = await response.json()
      return mapSingleResponse(data)
    } catch (error) {
      // If it's a fetch error (network), don't retry
      if (retryCount >= maxRetries || !(error instanceof Error) || !error.message.includes('locked')) {
        throw error
      }
      retryCount++
    }
  }
  
  throw new Error('Failed to update account after multiple retries')
}

/**
 * Deletes an account
 */
export async function deleteAccount(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to delete account: ${response.statusText}`)
  }
}

/**
 * Fetches industrial sectors for Industry dropdown
 */
export async function fetchIndustrialSectors(): Promise<IndustryOption[]> {
  const response = await fetch(`${API_BASE_URL}/industrial-sectors`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch industrial sectors: ${response.statusText}`)
  }
  
  const data: ApiListResponse<ApiIndustrialSector> = await response.json()
  return data.value.map(sector => ({
    id: sector.code,
    description: sector.description
  }))
}

/**
 * Fetches contact persons for Contact dropdown
 */
export async function fetchContacts(): Promise<ContactOption[]> {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.statusText}`)
  }
  
  const data: ApiListResponse<ApiContact> = await response.json()
  return data.value.map(contact => ({
    id: contact.id,
    displayId: contact.displayId,
    formattedName: contact.formattedName
  }))
}

/**
 * Fetches employees for Owner dropdown
 */
export async function fetchEmployees(): Promise<EmployeeOption[]> {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.statusText}`)
  }
  
  const data: ApiListResponse<ApiEmployee> = await response.json()
  return data.value.map(employee => ({
    id: employee.id,
    displayId: employee.displayId,
    formattedName: employee.formattedName
  }))
}
