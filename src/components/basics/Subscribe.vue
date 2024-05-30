<script setup lang="ts">
const { twitterBorderColor, defaultTransition } = useTailwindConfig()
</script>

<template>
  <div
    class="flex flex-col gap-2 p-3 m-2 overflow-hidden border rounded-2xl dark:bg-dim-700"
    :class="twitterBorderColor"
  >
    <h3 class="text-xl font-extrabold text-gray-900 dark:text-white" :class="twitterBorderColor">
      Subscribe to Premium
    </h3>

    <p class="text-sm text-black" :class="defaultTransition">
      Subscribe to unlock new features and if eligible, receive a share of ads revenue.
    </p>
    <button
      class="mt-2 px-5 py-3 text-sm font-bold text-white sm:text-sm bg-black w-36 rounded-full hover:bg-dim-150 dark:text-black dark:bg-white"
      :class="defaultTransition"
    >
      Subscribe
    </button>
  </div>
</template>

<style scoped lang="scss"></style>
