# Entity Migration Guide: Adapting to New CRM Entities

This guide explains how to adapt this application to work with different entities from SAP Sales and Service Cloud V2 (e.g., Opportunities, Leads, Tickets, Activities, etc.).

## Overview

The application follows a modular architecture that makes it easy to add new entities. Each entity requires:

1. TypeScript interface definition
2. API service with mappers
3. Pinia store for state management
4. UI components (table, modal, page)
5. Optional: Analytics components

## Step-by-Step Migration Process

### Step 1: Gather API Information

Before starting, collect the following information about your target entity:

#### Required Information Checklist

- [ ] **API Base Endpoint**: e.g., `/sap/c4c/api/v1/opportunity-service/opportunities`
- [ ] **Entity Structure**: Sample JSON response from API (GET single item)
- [ ] **Field Mapping**: Map API field names to desired frontend display names
- [ ] **Authentication**: Same credentials or different?
- [ ] **Related Endpoints**: Any dropdown data sources (like industries, contacts)?
- [ ] **OData Support**: Does the endpoint support `$top`, `$skip`, `$orderby`, `$filter`?
- [ ] **If-Match Requirement**: Does UPDATE require If-Match header?

#### API Documentation

Access the OpenAPI schema if available:
```
/sap/c4c/api/v1/repository-service/openApiSchemas/{serviceName}.openapischema.{entityName}
```

Example for Opportunities:
```
/sap/c4c/api/v1/repository-service/openApiSchemas/sap.crm.opportunityengagementservice.openapischema.opportunities
```

### Step 2: Define TypeScript Interface

Create or update `src/types/index.ts` with your entity interface.

#### Example: Opportunities Interface

```typescript
export interface Opportunity {
  // Display ID (e.g., "OPP-1001")
  opportunityId: string
  
  // UUID from API
  id: string
  
  // Core fields
  name: string
  accountId: string
  accountName: string
  closeDate: string
  stage: OpportunityStage
  probability: number
  amount: string
  currency: string
  
  // Owner information
  owner: string
  ownerId: string
  
  // Status
  status: Status
  
  // For If-Match header
  updatedOn?: string
}

export type OpportunityStage = 
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost'

// Dropdown options (if applicable)
export interface StageOption {
  id: string
  description: string
}
```

#### Guidelines for Field Selection

If you don't have specific requirements, select the **10 most important fields**:

**Must-Have Fields (always include):**
1. ID field (displayId for UI, id UUID for API)
2. Name/Title field (primary identifier)
3. Status field (lifecycle state)
4. Owner field (responsible person)
5. Created/Updated timestamps (for If-Match)

**Commonly Useful Fields:**
6. Related parent entity (e.g., Account for Opportunity)
7. Priority/Importance indicator
8. Amount/Value (if financial entity)
9. Date field (due date, close date, etc.)
10. Category/Type classification

### Step 3: Create API Service

Create `src/services/{entity}Api.ts` with CRUD operations and mappers.

#### Template: src/services/opportunityApi.ts

```typescript
import type { Opportunity, StageOption } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// API Response types (match actual API structure)
interface ApiOpportunity {
  id: string
  displayId: string
  name: string
  accountId: string
  accountName: string
  expectedCloseDate: string
  opportunityStage: string
  probabilityPercent: number
  expectedRevenue: {
    amount: number
    currency: string
  }
  ownerId: string
  ownerFormattedName: string
  lifeCycleStatus: string
  adminData: {
    updatedOn: string
  }
}

interface ApiListResponse<T> {
  value: T[]
}

interface ApiSingleResponse<T> {
  value: T
}

// ===========================
// Mapper Functions
// ===========================

/**
 * Core mapper: Transforms API structure to frontend model
 */
export function mapOpportunityFromApi(apiOpp: ApiOpportunity): Opportunity {
  return {
    opportunityId: apiOpp.displayId,
    id: apiOpp.id,
    name: apiOpp.name,
    accountId: apiOpp.accountId,
    accountName: apiOpp.accountName,
    closeDate: apiOpp.expectedCloseDate,
    stage: mapStageFromApi(apiOpp.opportunityStage),
    probability: apiOpp.probabilityPercent,
    amount: `${apiOpp.expectedRevenue.currency} ${apiOpp.expectedRevenue.amount.toLocaleString()}`,
    currency: apiOpp.expectedRevenue.currency,
    owner: apiOpp.ownerFormattedName,
    ownerId: apiOpp.ownerId,
    status: mapStatusFromApi(apiOpp.lifeCycleStatus),
    updatedOn: apiOpp.adminData.updatedOn
  }
}

/**
 * Maps single response (unwraps {value: {...}})
 */
export function mapSingleResponse(response: ApiSingleResponse<ApiOpportunity>): Opportunity {
  return mapOpportunityFromApi(response.value)
}

/**
 * Maps list response (unwraps {value: [...]})
 */
export function mapListResponse(response: ApiListResponse<ApiOpportunity>): Opportunity[] {
  return response.value.map(mapOpportunityFromApi)
}

/**
 * Maps frontend model to API structure for create/update
 */
export function mapOpportunityToApi(opp: Partial<Opportunity>) {
  // Parse amount if it's a formatted string
  const amount = typeof opp.amount === 'string'
    ? parseFloat(opp.amount.replace(/[^0-9.]/g, ''))
    : opp.amount

  return {
    name: opp.name,
    accountId: opp.accountId,
    expectedCloseDate: opp.closeDate,
    opportunityStage: mapStageToApi(opp.stage),
    probabilityPercent: opp.probability,
    expectedRevenue: {
      amount: amount,
      currency: opp.currency || 'USD'
    },
    ownerId: opp.ownerId,
    lifeCycleStatus: mapStatusToApi(opp.status)
  }
}

// Helper mappers
function mapStageFromApi(apiStage: string): OpportunityStage {
  // Implement based on actual API values
  const stageMap: Record<string, OpportunityStage> = {
    'QUALIFICATION': 'Qualification',
    'PROPOSAL': 'Proposal',
    'NEGOTIATION': 'Negotiation',
    'CLOSED_WON': 'Closed Won',
    'CLOSED_LOST': 'Closed Lost'
  }
  return stageMap[apiStage] || 'Qualification'
}

function mapStageToApi(stage?: OpportunityStage): string {
  const apiStageMap: Record<string, string> = {
    'Qualification': 'QUALIFICATION',
    'Proposal': 'PROPOSAL',
    'Negotiation': 'NEGOTIATION',
    'Closed Won': 'CLOSED_WON',
    'Closed Lost': 'CLOSED_LOST'
  }
  return apiStageMap[stage || 'Qualification'] || 'QUALIFICATION'
}

function mapStatusFromApi(apiStatus: string): Status {
  // Reuse existing Status type or create entity-specific one
  if (apiStatus.includes('ACTIVE')) return 'Active'
  if (apiStatus.includes('REVIEW')) return 'Review'
  return 'Inactive'
}

function mapStatusToApi(status?: Status): string {
  if (status === 'Active') return 'ACTIVE'
  if (status === 'Review') return 'REVIEW'
  return 'INACTIVE'
}

// ===========================
// API Client Functions
// ===========================

export async function fetchOpportunities(params?: {
  top?: number
  skip?: number
  orderby?: string
  filter?: string
}): Promise<{ opportunities: Opportunity[], count: number }> {
  const queryParams = new URLSearchParams()
  
  if (params?.top) queryParams.append('$top', params.top.toString())
  if (params?.skip) queryParams.append('$skip', params.skip.toString())
  if (params?.orderby) queryParams.append('$orderby', params.orderby)
  if (params?.filter) queryParams.append('$filter', params.filter)
  queryParams.append('$count', 'true')  // Always include count for pagination
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  
  const response = await fetch(`${API_BASE_URL}/opportunities${queryString}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch opportunities: ${response.statusText}`)
  }
  
  const data: ApiListResponse<ApiOpportunity> = await response.json()
  return {
    opportunities: mapListResponse(data),
    count: data.count || 0
  }
}

export async function fetchOpportunityById(id: string): Promise<Opportunity> {
  const response = await fetch(`${API_BASE_URL}/opportunities/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch opportunity: ${response.statusText}`)
  }
  
  const data: ApiSingleResponse<ApiOpportunity> = await response.json()
  return mapSingleResponse(data)
}

export async function createOpportunity(opp: Partial<Opportunity>): Promise<Opportunity> {
  const apiOpp = mapOpportunityToApi(opp)
  
  const response = await fetch(`${API_BASE_URL}/opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiOpp)
  })
  
  if (!response.ok) {
    throw new Error(`Failed to create opportunity: ${response.statusText}`)
  }
  
  const data: ApiSingleResponse<ApiOpportunity> = await response.json()
  return mapSingleResponse(data)
}

export async function updateOpportunity(
  id: string,
  opp: Partial<Opportunity>,
  ifMatch: string
): Promise<Opportunity> {
  const apiOpp = mapOpportunityToApi(opp)
  
  const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'If-Match': ifMatch
    },
    body: JSON.stringify(apiOpp)
  })
  
  if (!response.ok) {
    throw new Error(`Failed to update opportunity: ${response.statusText}`)
  }
  
  const data: ApiSingleResponse<ApiOpportunity> = await response.json()
  return mapSingleResponse(data)
}

export async function deleteOpportunity(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    throw new Error(`Failed to delete opportunity: ${response.statusText}`)
  }
}

// Additional endpoints for dropdowns (if applicable)
export async function fetchOpportunityStages(): Promise<StageOption[]> {
  const response = await fetch(`${API_BASE_URL}/opportunity-stages`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stages: ${response.statusText}`)
  }
  
  const data: ApiListResponse<{ id: string; description: string }> = await response.json()
  return data.value
}
```

### Step 4: Create Pinia Store

Create `src/stores/use{Entity}Store.ts`.

#### Template: src/stores/useOpportunityStore.ts

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Opportunity, StageOption } from '@/types'
import * as api from '@/services/opportunityApi'

export const useOpportunityStore = defineStore('opportunity', () => {
  // State
  const opportunities = ref<Opportunity[]>([])
  const totalCount = ref(0)  // For pagination
  const stages = ref<StageOption[]>([])
  
  const loading = ref(false)
  const loadingStages = ref(false)
  
  const error = ref<string | null>(null)
  const errorStages = ref<string | null>(null)

  // Getters
  const activeOpportunities = computed(() =>
    opportunities.value.filter(o => o.status === 'Active')
  )

  const opportunitiesCount = computed(() => opportunities.value.length)
  
  const totalAmount = computed(() => {
    return opportunities.value.reduce((sum, opp) => {
      const amount = parseFloat(opp.amount.replace(/[^0-9.]/g, ''))
      return sum + (amount || 0)
    }, 0)
  })

  // Actions
  async function fetchOpportunities(page: number = 1, itemsPerPage: number = 30) {
    loading.value = true
    error.value = null
    try {
      const skip = (page - 1) * itemsPerPage
      const result = await api.fetchOpportunities({
        top: itemsPerPage,
        skip: skip,
        orderby: 'name asc'
      })
      opportunities.value = result.opportunities
      totalCount.value = result.count
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch opportunities'
      console.error('Error fetching opportunities:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchStages() {
    loadingStages.value = true
    errorStages.value = null
    try {
      stages.value = await api.fetchOpportunityStages()
    } catch (e) {
      errorStages.value = e instanceof Error ? e.message : 'Failed to fetch stages'
      console.error('Error fetching stages:', e)
    } finally {
      loadingStages.value = false
    }
  }

  async function fetchDropdownData() {
    await Promise.all([fetchStages()])
  }

  async function fetchSingleForUpdate(id: string): Promise<Opportunity> {
    try {
      return await api.fetchOpportunityById(id)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to fetch opportunity'
      console.error('Error fetching single opportunity:', e)
      throw new Error(message)
    }
  }

  async function addOpportunity(opp: Partial<Opportunity>) {
    loading.value = true
    error.value = null
    try {
      const newOpp = await api.createOpportunity(opp)
      opportunities.value.push(newOpp)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create opportunity'
      console.error('Error creating opportunity:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateOpportunity(oppId: string, updates: Partial<Opportunity>) {
    loading.value = true
    error.value = null
    try {
      const opp = opportunities.value.find(o => o.opportunityId === oppId)
      if (!opp) throw new Error('Opportunity not found')

      const freshOpp = await fetchSingleForUpdate(opp.id)
      if (!freshOpp.updatedOn) {
        throw new Error('No updatedOn timestamp found')
      }

      const updatedOpp = await api.updateOpportunity(opp.id, updates, freshOpp.updatedOn)
      
      const index = opportunities.value.findIndex(o => o.opportunityId === oppId)
      if (index !== -1) {
        opportunities.value[index] = updatedOpp
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update opportunity'
      console.error('Error updating opportunity:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteOpportunity(oppId: string) {
    loading.value = true
    error.value = null
    try {
      const opp = opportunities.value.find(o => o.opportunityId === oppId)
      if (!opp) throw new Error('Opportunity not found')

      await api.deleteOpportunity(opp.id)
      opportunities.value = opportunities.value.filter(o => o.opportunityId !== oppId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete opportunity'
      console.error('Error deleting opportunity:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  function getOpportunityById(oppId: string): Opportunity | undefined {
    return opportunities.value.find(o => o.opportunityId === oppId)
  }

  return {
    opportunities,
    totalCount,  // For pagination
    stages,
    loading,
    loadingStages,
    error,
    errorStages,
    activeOpportunities,
    opportunitiesCount,
    totalAmount,
    fetchOpportunities,
    fetchStages,
    fetchDropdownData,
    fetchSingleForUpdate,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunityById
  }
})
```

### Step 5: Update Express Proxy Server

Add new endpoints to `server/index.js` for your entity.

```javascript
// Get all opportunities
app.get('/api/opportunities', async (req, res) => {
  try {
    const { $top, $skip, $orderby, $filter } = req.query
    
    const params = new URLSearchParams()
    if ($top) params.append('$top', $top)
    if ($skip) params.append('$skip', $skip)
    if ($orderby) params.append('$orderby', $orderby)
    if ($filter) params.append('$filter', $filter)
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    const response = await crmRequest(`/sap/c4c/api/v1/opportunity-service/opportunities${queryString}`)
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get single opportunity
app.get('/api/opportunities/:id', async (req, res) => {
  try {
    const response = await crmRequest(`/sap/c4c/api/v1/opportunity-service/opportunities/${req.params.id}`)
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching opportunity:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create opportunity
app.post('/api/opportunities', async (req, res) => {
  try {
    const response = await crmRequest('/sap/c4c/api/v1/opportunity-service/opportunities', {
      method: 'POST',
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    
    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating opportunity:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update opportunity
app.patch('/api/opportunities/:id', async (req, res) => {
  try {
    const ifMatch = req.headers['if-match']
    
    if (!ifMatch) {
      return res.status(400).json({ error: 'If-Match header is required' })
    }
    
    const response = await crmRequest(`/sap/c4c/api/v1/opportunity-service/opportunities/${req.params.id}`, {
      method: 'PATCH',
      headers: {
        'If-Match': ifMatch
      },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error updating opportunity:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete opportunity
app.delete('/api/opportunities/:id', async (req, res) => {
  try {
    await crmRequest(`/sap/c4c/api/v1/opportunity-service/opportunities/${req.params.id}`, {
      method: 'DELETE'
    })
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting opportunity:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get opportunity stages (for dropdown)
app.get('/api/opportunity-stages', async (req, res) => {
  try {
    const response = await crmRequest('/sap/c4c/api/v1/opportunity-service/opportunityStages')
    const data = await response.json()
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching opportunity stages:', error)
    res.status(500).json({ error: error.message })
  }
})
```

### Step 6: Create UI Components

Reuse existing components with entity-specific data:

#### A. Duplicate and Modify AccountModal

Create `src/components/OpportunityModal.vue` by copying `AccountModal.vue` and:

1. Update form fields to match Opportunity interface
2. Update dropdown options (stages, currencies, etc.)
3. Update validation rules
4. Connect to `useOpportunityStore`

#### B. Reuse SapTable Component

The generic `SapTable`, `SapTableRow`, and `SapTableHeader` components can be reused by passing different column definitions.

#### C. Create Page Component

Create `src/views/OpportunitiesPage.vue` by copying `AccountsPage.vue` and:

1. Import `useOpportunityStore` instead of `useAccountStore`
2. Update search keys to match Opportunity fields
3. Replace `AccountModal` with `OpportunityModal`
4. Update page title and labels

### Step 7: Add Route (Optional)

If using Vue Router, add route in `src/router/index.ts`:

```typescript
{
  path: '/opportunities',
  name: 'opportunities',
  component: () => import('@/views/OpportunitiesPage.vue')
}
```

### Step 8: Test Integration

#### Testing Checklist

- [ ] Fetch opportunities from API
- [ ] Display opportunities in table
- [ ] Sort and search functionality
- [ ] Open create modal with empty form
- [ ] Create new opportunity via API
- [ ] Open edit modal with populated form
- [ ] Update opportunity via API (with If-Match)
- [ ] Delete opportunity via API
- [ ] Dropdown data loads (stages, etc.)
- [ ] Error handling for API failures
- [ ] Loading states display correctly

## Quick Reference: Entity Adaptation Checklist

### 1. API Research
- [ ] Get sample JSON response
- [ ] Identify primary key fields (displayId, id)
- [ ] Map 10-15 most important fields
- [ ] Identify dropdown data sources
- [ ] Check If-Match requirement

### 2. TypeScript
- [ ] Create entity interface in `types/index.ts`
- [ ] Define dropdown option interfaces
- [ ] Export entity type

### 3. API Service
- [ ] Create `src/services/{entity}Api.ts`
- [ ] Implement mappers (fromApi, toApi, single, list)
- [ ] Implement CRUD functions
- [ ] Implement dropdown fetch functions

### 4. Pinia Store
- [ ] Create `src/stores/use{Entity}Store.ts`
- [ ] Define state (items, dropdown data, loading, errors)
- [ ] Define getters (active items, count, totals)
- [ ] Implement fetch, create, update, delete actions
- [ ] Implement dropdown data fetching

### 5. Express Proxy
- [ ] Add GET /api/{entities}
- [ ] Add GET /api/{entities}/:id
- [ ] Add POST /api/{entities}
- [ ] Add PATCH /api/{entities}/:id
- [ ] Add DELETE /api/{entities}/:id
- [ ] Add dropdown endpoints

### 6. UI Components
- [ ] Duplicate and customize modal component
- [ ] Update form fields and validation
- [ ] Reuse table components with new columns
- [ ] Create page component
- [ ] Update search keys
- [ ] Connect to store

### 7. Testing
- [ ] Test all CRUD operations
- [ ] Test dropdowns
- [ ] Test error handling
- [ ] Test loading states

## Common Patterns

### UUID vs Display ID Pattern

Always store both:
- **UUID (`id`)**: Used for API calls (never shown to user)
- **Display ID (`entityId`)**: Shown in UI (user-friendly, e.g., "OPP-1001")

### Dropdown Data Pattern

1. Define option interface in types
2. Add state in store for options
3. Create fetch function in API service
4. Call fetch on page mount (before main data)
5. Use computed properties in modal for dropdown options

### If-Match Pattern

Always fetch fresh entity before update:
```typescript
const freshEntity = await fetchSingleForUpdate(entity.id)
await api.updateEntity(entity.id, updates, freshEntity.updatedOn)
```

### Nested Data Pattern

Map nested API structures to flat frontend structures:

```typescript
// API: { defaultAddress: { country: "US" } }
// Frontend: { country: "US" }

// Mapper:
country: apiEntity.defaultAddress?.country || ''
```

## Entity-Specific Tips

### Financial Entities (Opportunities, Quotes)
- Include amount, currency, probability fields
- Add charts for revenue analysis
- Format currency for display

### Time-Based Entities (Activities, Tasks)
- Include due date, start date, end date
- Add calendar integration
- Show overdue indicators

### Hierarchical Entities (Accounts with Contacts)
- Include parent/child relationships
- Add navigation between related entities
- Show relationship counts

### Document Entities (Notes, Attachments)
- Include file upload/download
- Show file size and type
- Add preview functionality

## Troubleshooting

### API Returns 404
- Check endpoint URL format
- Verify entity service name in path
- Confirm API version (v1, v2)

### Field Not Mapping Correctly
- Check exact API field name (case-sensitive)
- Verify nested structure in API response
- Add console.log in mapper to debug

### Dropdown Empty
- Verify dropdown endpoint in Express server
- Check API response structure
- Ensure fetch called before main data

### Update Fails with 412 Precondition Failed
- If-Match header is incorrect or stale
- Fetch fresh entity before update
- Check updatedOn field exists

## Advanced: Multi-Entity Applications

For applications with multiple entities:

1. **Shared Components**: Reuse table, input, button components
2. **Generic Services**: Extract common API logic to base service
3. **Unified Error Handling**: Create centralized error handler
4. **Navigation Menu**: Add links to all entity pages
5. **Cross-Entity Relationships**: Link related entities (Account → Opportunities)

## Conclusion

This pattern-based approach allows you to quickly adapt the application to any SAP CRM entity by following these structured steps. The key is maintaining consistency in:

- Mapper patterns (fromApi, toApi, single, list)
- Store structure (state, getters, actions)
- Component reuse (tables, modals, inputs)
- Error handling and loading states

With this guide, migrating to a new entity should take **1-3 hours** depending on complexity.
