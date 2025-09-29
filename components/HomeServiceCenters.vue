<template>
  <section class="container mx-auto px-4 py-12" dir="rtl">
    <div class="flex flex-col items-center gap-4 text-center">
      <h2 class="text-2xl font-bold text-slate-800">
        مراکز خدمات سازگار در سراسر کشور
      </h2>
      <p class="max-w-2xl text-sm text-slate-500">
        شبکه نمایندگی‌های ما در شهرهای مختلف آماده ارائه خدمات پس از فروش، تعمیر
        تخصصی و پشتیبانی حضوری است. نزدیک‌ترین مرکز به خود را پیدا کنید و از
        خدمات ممتاز سازگار بهره ببرید.
      </p>
    </div>

    <ServiceCenterCarousel
      class="mx-auto mt-12 max-w-5xl"
      :centers="centers"
      :autoplay-interval="6000"
    />

    <div class="mt-10 flex justify-center">
      <NuxtLink
        to="/representatives"
        class="inline-flex items-center gap-2 rounded-full border border-sky-500 px-6 py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
      >
        مشاهده تمام مراکز
        <Icon name="ph:arrow-left" size="18" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import ServiceCenterCarousel from "@/components/ServiceCenterCarousel.vue";
import { getServiceCenters } from "@/utils/service-centers";
import type { ServiceCenter } from "@/types/service-center";

const centers: ServiceCenter[] = await getServiceCenters();
</script>
