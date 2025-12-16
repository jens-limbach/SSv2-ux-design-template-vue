import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export function useSearch<T extends Record<string, any>>(
  items: Ref<T[]>,
  searchKeys: (keyof T)[]
) {
  const searchTerm = ref('')
  const isSearchActive = ref(false)

  const filteredItems = computed(() => {
    if (!searchTerm.value) return items.value

    const term = searchTerm.value.toLowerCase()
    return items.value.filter(item =>
      searchKeys.some(key => {
        const value = item[key]
        return String(value).toLowerCase().includes(term)
      })
    )
  })

  const toggleSearch = () => {
    isSearchActive.value = !isSearchActive.value
    if (!isSearchActive.value) {
      searchTerm.value = ''
    }
  }

  const clearSearch = () => {
    searchTerm.value = ''
  }

  const handleBlur = () => {
    if (!searchTerm.value) {
      isSearchActive.value = false
    }
  }

  return {
    searchTerm,
    isSearchActive,
    filteredItems,
    toggleSearch,
    clearSearch,
    handleBlur
  }
}
