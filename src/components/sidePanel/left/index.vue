<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/solid'
import {
  SearchIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  DocumentTextIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
} from '@heroicons/vue/outline'

const { defaultTransition } = useTailwindConfig()
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="p-2 my-1 hover:bg-twitterGray rounded-full w-min dark:hover:bg-white/20" :class="defaultTransition">
      <NuxtLink to="/">
        <div class="w-10 h-10 flex justify-center">
          <LogoTwitter />
        </div>
      </NuxtLink>
    </div>

    <div class="space-y-1">
      <SidePanelLeftTab active>
        <template #icon>
          <HomeIcon />
        </template>
        <template #name>Home</template>
      </SidePanelLeftTab>

      <SidePanelLeftTab>
        <template #icon>
          <SearchIcon />
        </template>
        <template #name>Explore</template>
      </SidePanelLeftTab>

      <SidePanelLeftTab>
        <template #icon>
          <BellIcon />
        </template>
        <template #name>Notifications</template>
      </SidePanelLeftTab>

      <SidePanelLeftTab>
        <template #icon>
          <InboxIcon />
        </template>
        <template #name>Messages</template>
      </SidePanelLeftTab>

      <SidePanelLeftTab>
        <template #icon>
          <BookmarkIcon />
        </template>
        <template #name>Bookmarks</template>
      </SidePanelLeftTab>

      <SidePanelLeftTab>
        <template #icon>
          <DocumentTextIcon />
        </template>
        <template #name>Lists</template>
      </SidePanelLeftTab>

      <SidePanelLeftTab>
        <template #icon>
          <UserIcon />
        </template>
        <template #name>Profile</template>
      </SidePanelLeftTab>

      <SidePanelLeftTab>
        <template #icon>
          <DotsCircleHorizontalIcon />
        </template>
        <template #name>More</template>
      </SidePanelLeftTab>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
