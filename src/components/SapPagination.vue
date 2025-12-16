<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

// Smart pagination algorithm
// Shows: < [1] 2 3 ... 16 17 18 >
// or:    < 1 [2] 3 ... 16 17 18 >
// or:    < 1 2 [3] 4 ... 17 18 >
// or:    < 1 ... 4 [5] 6 ... 18 >
const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const current = props.currentPage
  const total = props.totalPages

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current <= 3) {
      // Near the beginning: 1 2 3 4 ... total-1 total
      for (let i = 2; i <= Math.min(4, total - 2); i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total - 1)
      pages.push(total)
    } else if (current >= total - 2) {
      // Near the end: 1 2 ... total-3 total-2 total-1 total
      pages.push(2)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // In the middle: 1 2 ... current-1 current current+1 ... total-1 total
      pages.push(2)
      pages.push('...')
      pages.push(current - 1)
      pages.push(current)
      pages.push(current + 1)
      pages.push('...')
      pages.push(total - 1)
      pages.push(total)
    }
  }

  return pages
})

const handlePageClick = (page: number | string) => {
  if (typeof page === 'number') {
    emit('update:currentPage', page)
  }
}

const handlePrevious = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const handleNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

const isCurrentPage = (page: number | string) => {
  return typeof page === 'number' && page === props.currentPage
}
</script>

<template>
  <div class="sap-crm-pagination">
    <!-- Previous Button -->
    <button
      class="sap-crm-btn sap-crm-btn--sm sap-crm-btn--pagination"
      :disabled="currentPage === 1"
      @click="handlePrevious"
      aria-label="Previous page">
      &lt;
    </button>

    <!-- Page Numbers -->
    <button
      v-for="(page, index) in pageNumbers"
      :key="`page-${index}`"
      class="sap-crm-btn sap-crm-btn--sm sap-crm-btn--pagination"
      :class="{ 'sap-crm-btn--selected': isCurrentPage(page) }"
      :disabled="page === '...'"
      @click="handlePageClick(page)"
      :aria-label="page === '...' ? 'More pages' : `Go to page ${page}`"
      :aria-current="isCurrentPage(page) ? 'page' : undefined">
      {{ page }}
    </button>

    <!-- Next Button -->
    <button
      class="sap-crm-btn sap-crm-btn--sm sap-crm-btn--pagination"
      :disabled="currentPage === totalPages"
      @click="handleNext"
      aria-label="Next page">
      &gt;
    </button>
  </div>
</template>

<style scoped>
/* Component-specific overrides if needed */
</style>
