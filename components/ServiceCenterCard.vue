<template>
  <NuxtLink
    :to="link"
    class="group relative block overflow-hidden rounded-[32px] bg-slate-100 shadow-[0_35px_60px_-30px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70 transition-transform duration-500"
    dir="rtl"
  >
    <div
      class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="filter: saturate(1.05)"
      :style="backgroundStyle"
      aria-hidden="true"
    ></div>
    <div
      class="absolute inset-0 z-10 bg-gradient-to-tr from-slate-900/60 via-slate-900/10 to-transparent"
      aria-hidden="true"
    ></div>
    <div
      class="relative z-20 flex h-full flex-col items-end justify-between gap-6 p-8 text-right text-slate-800"
      :class="sizeClass"
    >
      <div class="flex w-full items-start justify-between">
        <div class="flex flex-col items-end gap-1">
          <span
            class="text-lg font-bold text-sky-50 transition-colors duration-200 group-hover:text-white" style="text-shadow: 0 16px 36px rgba(15,23,42,0.55)"
          >
            {{ center.title }}
          </span>
          <span class="text-sm text-slate-100" style="text-shadow: 0 12px 24px rgba(15,23,42,0.4)">
            {{ center.tagline }}
          </span>
        </div>
        <span
          class="rounded-full bg-white/70 px-4 py-1 text-xs text-slate-600 backdrop-blur transition group-hover:bg-white"
        >
          {{ center.city }}
        </span>
      </div>

      <p class="text-sm leading-relaxed text-slate-100" style="text-shadow: 0 10px 28px rgba(15,23,42,0.5)">
        {{ center.summary }}
      </p>

      <span
        class="inline-flex items-center gap-1 self-start rounded-full bg-white/85 px-5 py-2 text-xs font-semibold text-sky-600 transition group-hover:bg-white"
      >
        اطلاعات بیشتر
        <Icon name="ph:arrow-left" size="16" />
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ServiceCenter } from "@/types/service-center";

const props = defineProps<{
  center: ServiceCenter;
  link?: string;
  size?: "lg" | "md";
}>();

const link = computed(
  () => props.link ?? `/representatives/${props.center.slug}`
);

const sizeClass = computed(() =>
  props.size === "lg" ? "min-h-[360px]" : "min-h-[260px]"
);

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${props.center.image})`,
}));
</script>
<!-- backgroundImage: `linear-gradient(135deg, rgba(15, 118, 227, 0.08), rgba(244, 247, 254, 0.75)), url(${props.center.image})`, -->


