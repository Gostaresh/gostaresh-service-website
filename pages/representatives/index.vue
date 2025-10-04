<template>
  <div class="space-y-12 pb-24" dir="rtl">
    <!-- Hero -->
    <section class="mx-auto max-w-4xl space-y-6 text-center">
      <div class="space-y-3">
        <p class="text-xs font-semibold tracking-[0.3em] text-sky-500">
          شبکه نمایندگی‌های گسترش سرویس
        </p>
        <h1 class="text-3xl font-bold text-slate-800 md:text-4xl">
          نزدیک‌ترین مرکز خدمات رسمی را پیدا کنید
        </h1>
        <p
          class="mx-auto max-w-3xl text-sm leading-7 text-slate-600 md:text-base"
        >
          فهرست کامل نمایندگی‌های مورد تأیید گسترش سرویس به تفکیک شهر، به همراه
          توضیح کوتاه از خدمات قابل ارائه در هر مرکز. به کمک جست‌وجو و فیلتر
          شهر، سریع‌تر نمایندگی مناسب را انتخاب کنید.
        </p>
      </div>

      <div
        class="flex flex-col gap-4 rounded-3xl bg-sky-50/60 p-6 text-slate-600 shadow-sm ring-1 ring-sky-100 md:flex-row md:items-center md:justify-center md:gap-8"
      >
        <div class="flex items-center justify-center gap-3">
          <span
            class="grid size-12 place-items-center rounded-2xl bg-white text-sky-500 shadow-sm"
          >
            <Icon name="ph:buildings-duotone" size="26" />
          </span>
          <div class="text-right">
            <p class="text-xs text-slate-500">تعداد نمایندگی فعال</p>
            <p class="text-lg font-bold text-slate-800">
              {{ toFa(totalCenters) }}
            </p>
          </div>
        </div>
        <span class="hidden h-10 w-px bg-sky-200 md:block"></span>
        <div class="flex items-center justify-center gap-3">
          <span
            class="grid size-12 place-items-center rounded-2xl bg-white text-sky-500 shadow-sm"
          >
            <Icon name="ph:map-pin-duotone" size="26" />
          </span>
          <div class="text-right">
            <p class="text-xs text-slate-500">تعداد شهرهای پوشش‌دهی</p>
            <p class="text-lg font-bold text-slate-800">
              {{ toFa(uniqueCities) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section
      class="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70"
    >
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <label
          class="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm focus-within:border-sky-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 md:max-w-xl"
        >
          <Icon
            name="ph:magnifying-glass-duotone"
            size="20"
            class="text-sky-500"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="جست‌وجوی نمایندگی بر اساس نام، شهر یا خدمات"
            class="w-full border-none bg-transparent text-sm focus:outline-none"
          />
        </label>

        <div class="flex items-center gap-3">
          <label class="text-xs font-semibold text-slate-500">انتخاب شهر</label>
          <select
            v-model="selectedCity"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            <option value="all">تمام شهرها</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section class="mx-auto max-w-6xl space-y-6">
      <div
        v-if="filteredCenters.length"
        class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        <ServiceCenterCard
          v-for="center in filteredCenters"
          :key="center.slug"
          :center="center"
          size="md"
        />
      </div>
      <div
        v-else
        class="rounded-3xl bg-slate-50 py-16 text-center text-sm text-slate-500"
      >
        هیچ نمایندگی مطابق با جست‌وجوی شما پیدا نشد.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ServiceCenterCard from "@/components/ServiceCenterCard.vue";
import { getServiceCenters } from "@/utils/service-centers";
import type { ServiceCenter } from "@/types/service-center";

const centers: ServiceCenter[] = await getServiceCenters();

const searchQuery = ref("");
const selectedCity = ref<string>("all");

const cities = computed(() =>
  Array.from(new Set(centers.map((center) => center.city))).sort((a, b) =>
    a.localeCompare(b, "fa")
  )
);

const matchesSearch = (center: ServiceCenter, query: string) => {
  if (!query) return true;
  const normalized = query.trim();
  if (!normalized) return true;
  const haystack = [center.title, center.city, center.summary, center.tagline]
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalized.toLowerCase());
};

const filteredCenters = computed(() =>
  centers.filter((center) => {
    const cityOk =
      selectedCity.value === "all" || center.city === selectedCity.value;
    const searchOk = matchesSearch(center, searchQuery.value);
    return cityOk && searchOk;
  })
);

const totalCenters = centers.length;
const uniqueCities = cities.value.length;

const digitMap = new Map([
  ["0", "۰"],
  ["1", "۱"],
  ["2", "۲"],
  ["3", "۳"],
  ["4", "۴"],
  ["5", "۵"],
  ["6", "۶"],
  ["7", "۷"],
  ["8", "۸"],
  ["9", "۹"],
]);

const toFa = (value: number | string) =>
  `${value}`.replace(/[0-9]/g, (digit) => digitMap.get(digit) ?? digit);

useSeoMeta({
  title: "نمایندگی‌های گسترش سرویس",
  description:
    "فهرست کامل نمایندگی‌های رسمی گسترش سرویس در سراسر کشور به همراه اطلاعات کوتاه از خدمات قابل ارائه.",
});
</script>
