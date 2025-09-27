<template>
  <div class="relative">
    <div
      class="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur ring-1 ring-slate-200 px-6 py-5 shadow-sm"
      aria-label="برندهای تحت پوشش"
    >
      <div
        v-if="marqueeBrands.length"
        class="brand-track"
        :class="{ 'is-paused': isHovered }"
        :style="{ animationDuration }"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <NuxtLink
          v-for="(b, idx) in marqueeBrands"
          :key="`${b.name}-${idx}`"
          :to="{ path: '/warranty/policies', query: { brand: b.name } }"
          :title="`شرایط گارانتی ${b.name}`"
          class="brand-item"
        >
          <img
            :src="b.logo"
            :alt="b.name"
            class="h-10 w-auto opacity-80 grayscale transition-[filter,opacity] duration-300 hover:grayscale-0 hover:opacity-100 group-hover:grayscale-0 group-hover:opacity-100"
            @error="onImgError($event, b.name)"
          />
        </NuxtLink>
      </div>

      <div v-else class="text-slate-400 text-sm px-2">
        لوگوی برندی موجود نیست.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Brand = { name: string; logo: string };

const brands = ref<Brand[]>([]);

try {
  brands.value = (await $fetch<Brand[]>("/data/brands.json")) ?? [];
} catch {
  try {
    brands.value = (await import("@/public/data/brands.json"))
      .default as Brand[];
  } catch {}
}

const isHovered = ref(false);

const marqueeBrands = computed<Brand[]>(() => {
  const list = brands.value;
  if (!list.length) return [];
  return [...list, ...list];
});

const animationDuration = computed(
  () => `${Math.max(18, brands.value.length * 3)}s`
);

const onImgError = (e: Event, name: string) => {
  const img = e.target as HTMLImageElement;
  img.replaceWith(
    Object.assign(document.createElement("div"), {
      className:
        "h-10 px-3 flex items-center justify-center rounded bg-slate-100 text-slate-500 text-xs",
      textContent: name,
    })
  );
};
</script>

<style scoped>
.brand-track {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  width: max-content;
  animation: brand-scroll 24s linear infinite;
  will-change: transform;
}

.brand-track.is-paused {
  /* animation-play-state: paused; */
}

.brand-item {
  display: grid;
  place-items: center;
  height: 4rem;
  min-width: 5.5rem;
}

@keyframes brand-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
