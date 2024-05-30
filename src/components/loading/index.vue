<script lang="ts" setup>
export interface Props {
  isPartially?: boolean
}

const props = defineProps<Props>()
const classObject = computed(() => ({
  loading: true,
  'loading--partially': props.isPartially,
}))
</script>
<template>
  <span :class="classObject">
    <span class="loading__overlay">
      <i class="fa-solid fa-gear fa-lg loading__spinner"></i>
    </span>
  </span>
</template>
