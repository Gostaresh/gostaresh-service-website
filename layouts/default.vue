<template>
  <div class="min-h-screen flex flex-col bg-slate-50 overflow-x-clip">
    <AppHeader />
    <main :class="mainClass">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";
import { computed } from "vue";
import { useWindowScroll } from "@vueuse/core";

const route = useRoute();
const { y } = useWindowScroll();

const atTop = computed(() => y.value <= 2);
const overlayHero = computed(() => route.path === "/" && atTop.value);

// اگر برای هدر h-16 می‌گذاری، از pt-16 استفاده کن؛ در غیر اینصورت این عدد را با قد واقعی هدرت هماهنگ کن.
const mainClass = computed(() => [
  "flex-1 container mx-auto px-4",
  overlayHero.value ? "pt-0 pb-6" : "pt-16 pb-6",
  "transition-[padding] duration-200",
]);
</script>
