<template>
  <div class="flex gap-6 overflow-x-auto py-2">
    <div
      v-for="b in brands"
      :key="b.name"
      class="shrink-0 flex items-center justify-center"
      style="width: 35vh"
    >
      <img
        :src="b.logo"
        :alt="b.name"
        class="h-12 md:h-14 w-auto opacity-80 hover:opacity-100 transition"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const brands = [
  { name: "Lenovo", logo: "/brands/lenovo.png" },
  { name: "ASUS", logo: "/brands/asus.png" },
  { name: "HP", logo: "/brands/hp.png" },
  { name: "Acer", logo: "/brands/acer.png" },
];
</script>
