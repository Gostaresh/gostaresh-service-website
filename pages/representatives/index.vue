<template>
  <div class="space-y-12" dir="rtl">
    <section class="space-y-6 text-center">
      <div class="space-y-3">
        <p class="text-xs font-semibold tracking-[0.3em] text-sky-500">
          شبکه نمایندگی‌های سازگار
        </p>
        <h1 class="text-2xl font-bold text-slate-800 md:text-3xl">
          شعب گارانتی سازگار در سراسر کشور
        </h1>
        <p class="mx-auto max-w-2xl text-sm leading-7 text-slate-600">
          در هر شهر تیمی از کارشناسان ما آماده ارائه خدمات پس از فروش، تعمیر
          تخصصی و پشتیبانی حضوری است. نزدیک‌ترین شعبه را پیدا کنید و به خدمات
          سریع و مطمئن سازگار دسترسی داشته باشید.
        </p>
      </div>
      <ServiceCenterCarousel
        class="mx-auto max-w-5xl"
        :centers="centers"
        :autoplay-interval="6000"
      />
    </section>

    <section
      class="rounded-3xl bg-gradient-to-l from-sky-50 via-white to-white p-8 shadow-sm ring-1 ring-slate-200/60"
    >
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div class="space-y-3 text-start">
          <h2 class="text-lg font-bold text-slate-800 md:text-xl">
            جست‌وجوی سریع نمایندگی‌ها
          </h2>
          <p class="mx-auto max-w-xl text-sm leading-7 text-slate-600">
            با فیلتر کردن بر اساس شهر یا نام شعبه می‌توانید سریع‌تر به اطلاعات
            تماس، ساعت کاری و خدمات ویژه هر مرکز دسترسی پیدا کنید.
          </p>
        </div>
        <div
          class="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500">تعداد مراکز فعال</span>
            <span class="text-sm font-semibold text-slate-700">{{
              toFa(totalCenters)
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500">شهرهای تحت پوشش</span>
            <span class="text-sm font-semibold text-slate-700">{{
              toFa(uniqueCities)
            }}</span>
          </div>
          <div class="pt-2">
            <NInput
              v-model:value="q"
              placeholder="جست‌وجوی شهر یا نمایندگی"
              clearable
            >
              <template #prefix>
                <Icon
                  name="ph:magnifying-glass-duotone"
                  class="text-base text-slate-400"
                />
              </template>
            </NInput>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between text-xs text-slate-500">
        <span>
          {{ toFa(filtered.length) }} مرکز مطابق با جست‌وجوی شما یافت شد.
        </span>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1 text-sky-600 transition hover:text-sky-700"
        >
          بازگشت به صفحه اصلی
          <Icon name="ph:arrow-left" size="14" />
        </NuxtLink>
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ServiceCenterCard
          v-for="center in filtered"
          :key="center.id"
          :center="center"
          size="md"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { NInput } from "naive-ui";
import ServiceCenterCard from "@/components/ServiceCenterCard.vue";
import ServiceCenterCarousel from "@/components/ServiceCenterCarousel.vue";
import { getServiceCenters } from "@/utils/service-centers";
import type { ServiceCenter } from "@/types/service-center";

const centers: ServiceCenter[] = await getServiceCenters();

const totalCenters = centers.length;
const uniqueCities = new Set(centers.map((item) => item.city)).size;

const q = ref("");

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s‌]+/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک");

const filtered = computed<ServiceCenter[]>(() => {
  const search = normalize(q.value ?? "");
  if (!search) {
    return centers;
  }
  return centers.filter((center) => {
    const haystack = normalize(
      `${center.title} ${center.city} ${center.tagline} ${center.summary}`
    );
    return haystack.includes(search);
  });
});

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
  title: "شعب گارانتی گسترش سرویس",
  description:
    "لیست نمایندگی‌ها و مراکز خدمات گارانتی گسترش سرویس در سراسر کشور به همراه اطلاعات تماس و مسیر دسترسی.",
});
</script>
