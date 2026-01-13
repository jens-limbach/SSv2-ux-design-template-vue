import { computed } from 'vue'
import type { Ref } from 'vue'

/**
 * Composable for URL-based filtering (not search box)
 * Filters items based on URL query parameters (status, priority, etc.)
 */
export function useUrlFilter<T extends Record<string, any>>(
  items: Ref<T[]>,
  _filterKeys: (keyof T)[]
) {
  const filteredItems = computed(() => {
    // For now, just return items as-is
    // URL filtering can be added here in the future
    return items.value
  })

  return {
    filteredItems
  }
}
