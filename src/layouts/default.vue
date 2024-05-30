<script setup lang="ts">
const darkMode = ref(false)
</script>

<template>
  <div :class="{ dark: darkMode }">
    <div class="bg-white dark:bg-dim-900">
      <div class="min-h-full">
        <div class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-4 lg:gap-2">
          <!-- LEFT SIDEBAR -->
          <div class="hidden md:block md:col-span-1 xl:col-span-2">
            <div class="sticky top-0">
              <SidePanelLeft />
            </div>
          </div>
          <!-- MAIN CONTENT -->

          <main class="col-span-12 md:col-span-8 xl:col-span-6">
            <router-view></router-view>
          </main>
          <!-- RIGHT SIDEBAR -->
          <div class="hidden col-span-12 lg:block md:col-span-3 xl:col-span-4">
            <div class="sticky top-0">
              <SidePanelRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
