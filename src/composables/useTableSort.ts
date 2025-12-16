import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { SortDirection } from '@/types'

export function useTableSort<T extends Record<string, any>>(items: Ref<T[]>) {
  const sortColumn = ref<keyof T | null>(null)
  const sortDirection = ref<SortDirection>(null)

  const sortedItems = computed(() => {
    if (!sortColumn.value || !sortDirection.value) {
      return items.value
    }

    return [...items.value].sort((a, b) => {
      const aVal = a[sortColumn.value!]
      const bVal = b[sortColumn.value!]

      // Handle currency strings ($2.5M, $850K)
      if (sortColumn.value === 'revenue') {
        const aNum = parseRevenue(String(aVal))
        const bNum = parseRevenue(String(bVal))
        return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
      }

      // Handle account IDs (ACC-1001)
      if (sortColumn.value === 'accountId') {
        const aNum = parseInt(String(aVal).replace('ACC-', ''))
        const bNum = parseInt(String(bVal).replace('ACC-', ''))
        return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
      }

      // Handle booleans
      if (typeof aVal === 'boolean') {
        const aNum = aVal ? 1 : 0
        const bNum = bVal ? 1 : 0
        return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
      }

      // Handle strings (default)
      const comparison = String(aVal).localeCompare(String(bVal))
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  })

  const sortBy = (column: keyof T) => {
    if (sortColumn.value === column) {
      // Cycle: asc -> desc -> null
      sortDirection.value =
        sortDirection.value === 'asc' ? 'desc' :
        sortDirection.value === 'desc' ? null : 'asc'

      if (sortDirection.value === null) {
        sortColumn.value = null
      }
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }

  const parseRevenue = (revenueStr: string): number => {
    const match = revenueStr.match(/\$?([\d.]+)([MK])?/)
    if (!match || !match[1]) return 0

    let value = parseFloat(match[1])
    if (match[2] === 'M') value *= 1000000
    if (match[2] === 'K') value *= 1000

    return value
  }

  return {
    sortedItems,
    sortBy,
    sortColumn,
    sortDirection
  }
}
