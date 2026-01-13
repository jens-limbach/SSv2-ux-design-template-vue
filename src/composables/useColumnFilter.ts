import { ref } from 'vue'

export interface ColumnFilterConfig {
  key: string
  label: string
  apiField: string // OData field path
  type: 'single' | 'multi'
}

export function useColumnFilter(filterConfigs: ColumnFilterConfig[]) {
  // Active filters: { status: ['Active', 'Blocked'], country: ['US'] }
  const activeFilters = ref<Record<string, string[]>>({})
  
  /**
   * Sync filters from URL query parameters on mount
   */
  function syncFromUrl() {
    const filters: Record<string, string[]> = {}
    const params = new URLSearchParams(window.location.search)
    
    filterConfigs.forEach(config => {
      const paramValue = params.get(config.key)
      if (paramValue) {
        // Parse comma-separated values
        const values = paramValue.split(',').map(v => v.trim()).filter(Boolean)
        if (values.length > 0) {
          filters[config.key] = values
        }
      }
    })
    
    activeFilters.value = filters
  }
  
  /**
   * Sync filters to URL query parameters
   */
  function syncToUrl() {
    const params = new URLSearchParams()
    
    Object.entries(activeFilters.value).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','))
      }
    })
    
    // Update URL without page reload
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    
    window.history.replaceState({}, '', newUrl)
  }
  
  /**
   * Build OData $filter string from active filters
   * Example: "(lifeCycleStatusDescription eq 'Active' or lifeCycleStatusDescription eq 'Blocked') and defaultAddress/country eq 'US'"
   */
  function buildODataFilter(): string {
    const filterParts: string[] = []
    
    Object.entries(activeFilters.value).forEach(([key, values]) => {
      if (values.length === 0) return
      
      const config = filterConfigs.find(c => c.key === key)
      if (!config) return
      
      if (values.length === 1) {
        // Single value: "field eq 'value'"
        const value = values[0]
        if (value) {
          filterParts.push(`${config.apiField} eq '${escapeODataValue(value)}'`)
        }
      } else {
        // Multiple values: "(field eq 'value1' or field eq 'value2')"
        const orParts = values
          .filter(Boolean)
          .map(value => `${config.apiField} eq '${escapeODataValue(value)}'`)
        if (orParts.length > 0) {
          filterParts.push(`(${orParts.join(' or ')})`)
        }
      }
    })
    
    return filterParts.join(' and ')
  }
  
  /**
   * Escape single quotes in OData values
   */
  function escapeODataValue(value: string): string {
    return value.replace(/'/g, "''")
  }
  
  /**
   * Set filter values for a specific key
   */
  function setFilter(key: string, values: string[]) {
    if (values.length === 0) {
      delete activeFilters.value[key]
    } else {
      activeFilters.value[key] = values
    }
    syncToUrl()
  }
  
  /**
   * Remove a specific filter
   */
  function removeFilter(key: string) {
    delete activeFilters.value[key]
    syncToUrl()
  }
  
  /**
   * Clear all filters
   */
  function clearFilters() {
    activeFilters.value = {}
    syncToUrl()
  }
  
  /**
   * Get active filter count
   */
  function getActiveFilterCount(): number {
    return Object.keys(activeFilters.value).length
  }
  
  /**
   * Get active filters as readable labels
   * Example: [{ key: 'status', label: 'Status: Active, Blocked', values: ['Active', 'Blocked'] }]
   */
  function getActiveFilterLabels(): Array<{ key: string; label: string; values: string[] }> {
    return Object.entries(activeFilters.value).map(([key, values]) => {
      const config = filterConfigs.find(c => c.key === key)
      const label = config ? config.label : key
      return {
        key,
        label: `${label}: ${values.join(', ')}`,
        values
      }
    })
  }
  
  return {
    activeFilters,
    syncFromUrl,
    syncToUrl,
    buildODataFilter,
    setFilter,
    removeFilter,
    clearFilters,
    getActiveFilterCount,
    getActiveFilterLabels
  }
}
