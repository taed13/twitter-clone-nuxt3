<script setup lang="ts">
import { DotsHorizontalIcon, PlusIcon } from '@heroicons/vue/outline'
const { defaultTransition } = useTailwindConfig()
const whatsHappeningItems = ref([
  {
    title: 'SpaceX',
    count: '18.8k Tweets',
  },
  {
    title: 'JavaScript',
    count: '12.5k Tweets',
  },
  {
    title: 'Nuxt 3',
    count: '9.3k Tweets',
  },
  {
    title: 'Vue 3',
    count: '7.2k Tweets',
  },
])

const whoToFollowItems = ref([
  {
    name: 'Joe Biden',
    handle: '@JoeBiden',
    image: 'https://cdn.openart.ai/uploads/image_tqZctK_Z_1698640454572_raw.jpg',
  },
  {
    name: 'Elon Musk',
    handle: '@elonmusk',
    image: 'https://cdn.openart.ai/stable_diffusion/a73d02d12300455f3df3d83d68e61be57888a08e_2000x2000.webp',
  },
  {
    name: 'Beyoncé',
    handle: '@Beyonce',
    image:
      'https://media1.popsugar-assets.com/files/thumbor/-yHEeO5rjmY5ERJHQXegW-ZZG08/9x192:2244x2427/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2020/02/11/900/n/1922398/112085525e431065dba032.37867622_/i/Beyonc%C3%A9-Knowles.jpg',
  },
])
</script>
<template>
  <div class="flex flex-col">
    <!-- Subscribe to Premium -->
    <BasicsSubscribe />
    <!-- Preview Card: What's happening -->
    <SidePanelRightPreviewCard title="What's happening">
      <SidePanelRightPreviewCardItem v-for="(item, index) in whatsHappeningItems" :key="index">
        <div class="flex flex-row justify-between p-2">
          <div class="flex flex-col">
            <h2 class="font-bold text-gray-800 text-md dark:text-white">{{ item.title }}</h2>
            <p class="text-xs text-gray-400">{{ item.count }}</p>
          </div>

          <div class="flex h-full">
            <button
              class="w-8 h-8 p-2 text-dark bg-transparent rounded-full hover:text-blue-500 hover:bg-blue-100 dark:text-black dark:bg-white"
              :class="defaultTransition"
            >
              <DotsHorizontalIcon />
            </button>
          </div>
        </div>
      </SidePanelRightPreviewCardItem>
    </SidePanelRightPreviewCard>

    <!-- Preview Card: Who to follow -->
    <SidePanelRightPreviewCard title="Who to follow">
      <SidePanelRightPreviewCardItem v-for="(item, index) in whoToFollowItems" :key="index">
        <div class="flex flex-row items-center justify-between p-2">
          <div class="flex flex-row">
            <img class="w-10 h-10 rounded-full" :src="item.image" :alt="item.name" />

            <div class="flex flex-col ml-2">
              <h1 class="text-sm font-bold text-gray-900 dark:text-white">{{ item.name }}</h1>
              <p class="text-xs text-gray-400">{{ item.handle }}</p>
            </div>
          </div>

          <div class="flex h-full">
            <button
              class="px-4 py-2 text-xs font-bold text-white md:hidden bg-black rounded-full hover:bg-dim-700 dark:text-black dark:bg-white"
              :class="defaultTransition"
            >
              Follow
            </button>
            <button
              class="hidden px-4 py-2 text-xs font-bold text-white md:block bg-black rounded-full hover:bg-dim-700 dark:text-black dark:bg-white"
            >
              +
            </button>
          </div>
        </div>
      </SidePanelRightPreviewCardItem>
    </SidePanelRightPreviewCard>
  </div>
</template>
