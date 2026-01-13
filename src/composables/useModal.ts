import { ref } from 'vue'
import type { ModalMode } from '@/types'

export function useModal() {
  const isOpen = ref(false)
  const mode = ref<ModalMode>('create')
  const editingId = ref<string | null>(null)

  const openModal = (modalMode: ModalMode = 'create', id: string | null = null) => {
    mode.value = modalMode
    editingId.value = id
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
    setTimeout(() => {
      mode.value = 'create'
      editingId.value = null
    }, 300) // Wait for modal animation to complete
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      closeModal()
    }
  }

  // Set up keyboard listener
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', handleEscapeKey)
  }

  const openCreateModal = () => {
    openModal('create')
  }

  const openEditModal = () => {
    openModal('edit')
  }

  return {
    isOpen,
    mode,
    editingId,
    openModal,
    openCreateModal,
    openEditModal,
    closeModal
  }
}
