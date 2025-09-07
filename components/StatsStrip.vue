<template>
  <section
    aria-labelledby="stats"
    class="container mx-auto px-4 py-6"
    dir="rtl"
  >
    <h2 id="stats" class="sr-only">آمار گسترش سرویس</h2>

    <div ref="rootEl" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="s in stats"
        :key="s.id"
        class="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 p-5 shadow-sm text-center"
      >
        <template v-if="loaded">
          <NStatistic
            :tabular-nums="true"
            :value="displayed[s.id] ?? 0"
            :suffix="s.suffix || ''"
            class="text-2xl font-extrabold"
          />
          <div class="mt-1 text-slate-600 text-sm">{{ s.label }}</div>
        </template>
        <template v-else>
          <NSkeleton text :repeat="2" />
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { NStatistic, NSkeleton } from "naive-ui";

type Stat = { id: string; label: string; value: number; suffix?: string };

const stats = ref<Stat[]>([]);
const loaded = ref(false);

// شمارشگر نرم 0 → مقدار
const displayed = reactive<Record<string, number>>({});
const animateTo = (key: string, to: number, ms = 1200) => {
  const start = performance.now();
  const from = 0;
  const step = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    displayed[key] = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); // easeOutCubic
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const rootEl = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    stats.value = (await import("@/public/data/service-stats.json"))
      .default as Stat[];
  } finally {
    // شروع انیمیشن بعد از دیده شدن
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          stats.value.forEach((s) => animateTo(s.id, s.value));
          loaded.value = true;
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (rootEl.value) io.observe(rootEl.value);
  }
});
</script>
