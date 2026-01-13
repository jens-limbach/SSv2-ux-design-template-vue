// TypeScript interfaces for the Accounts application

export interface Account {
  accountId: string // Maps to displayId from API
  id: string // UUID from API
  companyName: string // Maps to formattedName
  contactPerson: string // Maps to primaryContactformattedName
  primaryContactId: string // UUID for contact person
  owner: string // Maps to ownerFormattedName
  ownerId: string // UUID for owner
  website: string // Maps to defaultCommunication.web
  industry: string // Maps to defaultCommunication.industrialSectorDescription (display)
  industryCode?: string // Maps to defaultCommunication.industrialSector (code for updates)
  country: string // Maps to defaultAddress.country
  prospect: boolean // Maps to isProspect
  abcClassification: string // Maps to customerABCClassification (ID)
  abcClassificationDescription: string // Maps to customerABCClassificationDescription (Display)
  status: Status // Maps to lifeCycleStatusDescription
  statusCode?: string // Maps to lifeCycleStatus (Code for filtering - e.g., 'ACTIVE')
  updatedOn?: string // Maps to adminData.updatedOn (for If-Match header)
}

// Dropdown option interfaces
export interface IndustryOption {
  id: string
  description: string
}

export interface ContactOption {
  id: string
  displayId: string
  formattedName: string
}

export interface EmployeeOption {
  id: string
  displayId: string
  formattedName: string
}

export type Status = 'Active' | 'In Preparation' | 'Blocked' | 'Obsolete'

export type ModalMode = 'create' | 'edit'

export type SortDirection = 'asc' | 'desc' | null

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  type?: 'text' | 'email' | 'url' | 'currency' | 'boolean' | 'badge'
  width?: string
  align?: 'left' | 'center' | 'right'
}

export type ButtonVariant = 'primary' | 'secondary' | 'neutrallight'
export type ButtonSize = 'xsm' | 'sm' | 'md' | 'lg'

export type PriorityColor = 'red' | 'yellow' | 'blue'

export type RowStateType = 'success' | 'info' | 'caution' | 'error'
