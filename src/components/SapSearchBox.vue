<script setup lang="ts">
import { ref } from 'vue'
import SapIcon from './SapIcon.vue'
import SapButton from './SapButton.vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isActive = ref(false)
const inputRef = ref<HTMLInputElement>()

const toggleSearch = () => {
  isActive.value = !isActive.value
  if (isActive.value) {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 300)
  } else {
    emit('update:modelValue', '')
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearSearch = () => {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

const handleBlur = () => {
  if (!props.modelValue) {
    isActive.value = false
  }
}
</script>

<template>
  <div class="search-box" :class="{ active: isActive }">
    <input
      ref="inputRef"
      type="text"
      placeholder="Search..."
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
    />
    <button
      v-show="modelValue"
      class="search-clear-btn"
      @click="clearSearch"
      aria-label="Clear search">
      ✕
    </button>
  </div>
  <SapButton
    variant="secondary"
    size="md"
    icon-only
    class="search-toggle-btn"
    @click="toggleSearch"
    aria-label="Toggle search">
    <SapIcon type="search" size="md" />
  </SapButton>
</template>
