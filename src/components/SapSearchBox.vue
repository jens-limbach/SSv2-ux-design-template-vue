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
  'clear': []
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
  emit('clear')
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
    <SapButton
      v-show="modelValue"
      variant="secondary"
      size="sm"
      icon-only
      class="search-clear-btn"
      @click="clearSearch"
      aria-label="Clear search">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <path d="M18.6583118,5.34170571 C19.1138961,5.79732499 19.1138961,6.5360132 18.6583118,6.99163248 L13.65,12 L18.6583118,17.0084084 C19.1138961,17.4639926 19.1138961,18.2027275 18.6583118,18.6583118 C18.2027275,19.1138961 17.4639926,19.1138961 17.0084084,18.6583118 L12,13.65 L6.99163248,18.6583118 C6.5360132,19.1138961 5.79732499,19.1138961 5.34170571,18.6583118 C4.8860981,18.2027275 4.8860981,17.4639926 5.34170571,17.0084084 L10.35,12 L5.34170571,6.99163248 C4.8860981,6.5360132 4.8860981,5.79732499 5.34170571,5.34170571 C5.79732499,4.8860981 6.5360132,4.8860981 6.99163248,5.34170571 L12,10.35 L17.0084084,5.34170571 C17.4639926,4.8860981 18.2027275,4.8860981 18.6583118,5.34170571 Z"></path>
      </svg>
    </SapButton>
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
