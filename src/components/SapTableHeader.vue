<script setup lang="ts">
import type { Account, SortDirection } from '@/types'
import SapIcon from './SapIcon.vue'

interface Props {
  columns: Array<{ key: keyof Account; label: string; sortable?: boolean }>
  sortColumn: keyof Account | null
  sortDirection: SortDirection
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sort: [column: keyof Account]
}>()

const getSortIcon = (columnKey: keyof Account) => {
  if (props.sortColumn !== columnKey) {
    return 'unsorted'
  }
  return props.sortDirection === 'asc' ? 'ascending' : 'descending'
}

const handleSort = (column: keyof Account, sortable: boolean = true) => {
  if (sortable) {
    emit('sort', column)
  }
}
</script>

<template>
  <thead>
    <tr>
      <th 
        v-for="column in columns"
        :key="String(column.key)"
        class="sap-crm-table__cell sap-crm-table__cell--header"
        :style="{ cursor: column.sortable !== false ? 'pointer' : 'default' }"
        @click="handleSort(column.key, column.sortable !== false)">
        {{ column.label }}
        <SapIcon 
          v-if="column.sortable !== false"
          :type="getSortIcon(column.key)"
          size="sm"
          style="margin-left: 0.25rem; vertical-align: middle;"
        />
      </th>
      <th class="sap-crm-table__cell sap-crm-table__cell--header" style="width: 80px; text-align: center;">
        Actions
      </th>
    </tr>
  </thead>
</template>
