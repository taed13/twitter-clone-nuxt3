<script setup lang="ts">
const { twitterBorderColor, defaultTransition } = useTailwindConfig()

export interface Props {
  title: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="m-2 overflow-hidden border rounded-2xl dark:bg-dim-700" :class="twitterBorderColor">
    <h1 class="p-3 text-xl font-extrabold text-gray-900 dark:text-white" :class="twitterBorderColor">
      {{ props.title }}
    </h1>
    <slot></slot>

    <div
      class="p-3 text-sm text-blue-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300"
      :class="defaultTransition"
    >
      Show more
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
