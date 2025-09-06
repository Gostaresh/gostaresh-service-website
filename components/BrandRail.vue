<template>
  <div class="flex gap-6 overflow-x-auto py-2">
    <div
      v-for="b in brands"
      :key="b.name"
      class="shrink-0 flex items-center justify-center h-10"
    >
      <img
        :src="b.logo"
        :alt="b.name"
        class="h-8 w-auto opacity-80 hover:opacity-100 transition"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const brands = await $fetch("/data/brands.json");
</script>
