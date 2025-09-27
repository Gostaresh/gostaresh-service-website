<template>
  <div class="relative">
    <div
      class="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur ring-1 ring-slate-200 px-6 py-5 shadow-sm"
      aria-label="برندهای تحت پوشش"
    >
      <div
        v-if="brands.length"
        class="brand-track-wrapper"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div
          v-for="segment in 2"
          :key="segment"
          class="brand-track"
          :class="[
            { 'is-paused': isHovered },
            segment === 2 ? 'brand-track--clone' : null
          ]"
          :style="trackStyle"
        >
          <NuxtLink
            v-for="(b, idx) in brands"
            :key="`${b.name}-${idx}`"
            :to="{ path: '/warranty/policies', query: { brand: b.name } }"
            :title="`شرایط گارانتی ${b.name}`"
            class="brand-item"
          >
            <img
              :src="b.logo"
              :alt="b.name"
              class="h-10 w-auto opacity-80 grayscale transition-[filter,opacity] duration-300 hover:grayscale-0 hover:opacity-100"
              @error="onImgError($event, b.name)"
            />
          </NuxtLink>
        </div>
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
    brands.value = (await import("@/public/data/brands.json")).default as Brand[];
  } catch {}
}

const isHovered = ref(false);

const animationDuration = computed(() => `${Math.max(18, brands.value.length * 3)}s`);
const trackStyle = computed(() => ({ "--marquee-duration": animationDuration.value }));

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
.brand-track-wrapper {
  position: relative;
  height: 4rem;
  overflow: hidden;
}

.brand-track {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  min-width: max-content;
  animation: brand-scroll var(--marquee-duration, 24s) linear infinite;
  will-change: transform;
}

.brand-track--clone {
  animation-name: brand-scroll-clone;
}

.brand-track.is-paused {
  animation-play-state: paused;
}

.brand-item {
  display: grid;
  place-items: center;
  height: 4rem;
  min-width: 5.5rem;
}

@keyframes brand-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes brand-scroll-clone {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>

