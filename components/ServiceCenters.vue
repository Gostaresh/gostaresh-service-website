<template>
  <section class="container mx-auto px-4 py-6" dir="rtl">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold">مراکز خدمات</h2>
      <NInput
        v-model:value="q"
        placeholder="جستجو در شهر/نام/آدرس…"
        class="w-64 hidden md:block"
        clearable
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- لیست -->
      <div class="space-y-3">
        <article
          v-for="c in filtered"
          :key="c.id"
          class="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 p-5 shadow-sm"
        >
          <div class="flex items-center gap-2">
            <h3 class="font-semibold">{{ c.name }}</h3>
            <span class="text-xs text-slate-500">— {{ c.city }}</span>
            <span class="ms-auto text-xs text-slate-500">{{ c.hours }}</span>
          </div>
          <p class="mt-2 text-slate-700 text-sm">{{ c.address }}</p>

          <div class="mt-3 flex flex-wrap gap-2">
            <a class="btn-outline" :href="`tel:${c.phone}`" aria-label="تماس">
              <Icon name="ph:phone-duotone" /> تماس
            </a>
            <a
              class="btn-outline"
              :href="c.maps"
              target="_blank"
              rel="noopener"
              aria-label="نقشه"
            >
              <Icon name="ph:map-pin-duotone" /> مشاهده در نقشه
            </a>
          </div>
        </article>

        <template v-if="!centers.length">
          <NSkeleton text :repeat="6" />
        </template>
      </div>

      <!-- جای نقشه/پوستر (فعلاً دمو) -->
      <div
        class="rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 ring-1 ring-slate-200 p-5"
      >
        <h3 class="font-semibold mb-2">نقشه مراکز (دمو)</h3>
        <p class="text-slate-600 text-sm">
          در نسخهٔ نهایی می‌توان از
          <b>Leaflet</b> یا <b>Google Maps</b> استفاده کرد. فعلاً با دکمهٔ
          «مشاهده در نقشه» از هر کارت استفاده کنید.
        </p>
        <div
          class="mt-4 h-64 rounded-xl bg-white/70 grid place-items-center text-slate-400"
        >
          نقشه به‌زودی…
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NInput, NSkeleton } from "naive-ui";

type Center = {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  geo?: { lat: number; lng: number };
  maps?: string;
};

const centers = ref<Center[]>([]);
const q = ref("");

onMounted(async () => {
  centers.value = (
    await import("@/public/data/service-centers.json")
  ).default as Center[];
});

const filtered = computed(() => {
  const s = q.value?.trim();
  if (!s) return centers.value;
  return centers.value.filter((c) => JSON.stringify(c).includes(s));
});
</script>

<style scoped>
.btn-outline {
  @apply inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ring-slate-300 text-slate-700 hover:bg-white transition;
}
</style>
