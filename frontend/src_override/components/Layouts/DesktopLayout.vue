<template>
  <div class="flex  w-full bg-[#233d48] h-screen">
    <div class="h-full border-r ">
      <AppSidebar />
    </div>
    <div class="flex-1 w-full flex flex-col h-full overflow-auto">
      <AppHeader />
      <slot />
    </div>
    <GlobalModals />
  </div>
</template>
<script setup>
import AppSidebar from '@/components/Layouts/AppSidebar.vue'
import AppHeader from '@/components/Layouts/AppHeader.vue'
import GlobalModals from '@/components/Modals/GlobalModals.vue'
</script>
