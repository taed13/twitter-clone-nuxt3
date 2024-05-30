<script setup lang="ts">
export interface Props {
  title: string
  loading: boolean
}

const props = defineProps<Props>()

const { twitterBorderColor } = useTailwindConfig()
</script>

<template>
  <div class="border-x">
    <div
      class="sticky top-0 px-4 py-3 bg-white/80 backdrop-blur-md dark:bg-dim-900/80 border-y"
      :class="twitterBorderColor"
    >
      <h2 class="text-xl font-bold text-gray-800 dark:text">{{ props.title }}</h2>
    </div>
    <div v-if="loading" class="flex items-center justify-center p-4 border-b" :class="twitterBorderColor">
      <LoadingSpinner />
    </div>
    <div v-else class="border-b" :class="twitterBorderColor">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
