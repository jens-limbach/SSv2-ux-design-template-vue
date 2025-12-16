<script setup lang="ts">
import type { Account, SortDirection } from '@/types'
import SapTableHeader from './SapTableHeader.vue'
import SapTableRow from './SapTableRow.vue'

interface Props {
  accounts: Account[]
  sortColumn: keyof Account | null
  sortDirection: SortDirection
  selectedAccountId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedAccountId: null
})

const emit = defineEmits<{
  sort: [column: keyof Account]
  rowClick: [account: Account]
  delete: [id: string]
  update: [accountId: string, field: keyof Account, value: any]
}>()

const columns = [
  { key: 'accountId' as keyof Account, label: 'Account ID', sortable: true },
  { key: 'companyName' as keyof Account, label: 'Company Name', sortable: true },
  { key: 'prospect' as keyof Account, label: 'Prospect', sortable: true },
  { key: 'abcClassificationDescription' as keyof Account, label: 'ABC Classification', sortable: true },
  { key: 'status' as keyof Account, label: 'Status', sortable: true },
  { key: 'contactPerson' as keyof Account, label: 'Contact Person', sortable: true },
  { key: 'owner' as keyof Account, label: 'Owner', sortable: true },
  { key: 'website' as keyof Account, label: 'Website', sortable: true },
  { key: 'industry' as keyof Account, label: 'Industry', sortable: true },
  { key: 'country' as keyof Account, label: 'Country', sortable: true }
]

const handleSort = (column: keyof Account) => {
  emit('sort', column)
}

const handleRowClick = (account: Account) => {
  emit('rowClick', account)
}

const handleDelete = (id: string) => {
  emit('delete', id)
}

const handleUpdate = (field: keyof Account, value: any, account: Account) => {
  emit('update', account.accountId, field, value)
}
</script>

<template>
  <div class="sap-crm-table--wrapper">
    <table class="sap-crm-table">
      <SapTableHeader
        :columns="columns"
        :sort-column="sortColumn"
        :sort-direction="sortDirection"
        @sort="handleSort"
      />
      <tbody>
        <SapTableRow
          v-for="account in accounts"
          :key="account.accountId"
          :account="account"
          :selected="selectedAccountId === account.accountId"
          @click="handleRowClick(account)"
          @delete="handleDelete"
          @update="(field, value) => handleUpdate(field, value, account)"
        />
      </tbody>
    </table>
  </div>
</template>
