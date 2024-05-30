<script setup lang="ts">
const { defaultTransition } = useTailwindConfig()

export interface Props {
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
})

const textClasses = computed(() => (props.active ? 'font-semibold' : 'font-normal'))
</script>

<template>
  <NuxtLink
    to="#"
    class="flex items-center p-3 text-black rounded-full w-min hover:bg-gray-200 dark:hover:bg-dim-200 dark:text-white"
  >
    <div class="w-8 h-8 text-dark" :class="defaultTransition">
      <slot name="icon"></slot>
    </div>
    <div class="hidden ml-4 mr-3 text-xl xl:block" :class="textClasses">
      <slot name="name"></slot>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss"></style>
