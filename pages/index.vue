<template>
  <div class="space-y-10">
    <section class="bg-slate-900 text-white rounded-2xl p-8 md:p-12">
      <div class="flex items-center gap-4 mb-4">
        <img
          src="/brands/gs-warranty-logo.png"
          alt="گسترش سرویس"
          class="h-10 w-auto"
        />
        <h1 class="text-2xl md:text-3xl font-bold">
          گسترش سرویس — همیشه یک قدم جلوتر
        </h1>
      </div>
      <p class="text-slate-300 mb-6">
        سامانه‌ی استعلام وضعیت و شرایط گارانتی؛ ساده، شفاف و همیشه در دسترس.
      </p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/warranty/check"
          class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white"
          >استعلام وضعیت گارانتی</NuxtLink
        >
        <NuxtLink
          to="/warranty/policies"
          class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
          >شرایط گارانتی برندها</NuxtLink
        >
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-3">برندهای تحت پوشش</h2>
      <BrandRail />
    </section>
  </div>
</template>

<script setup lang="ts">
import BrandRail from "@/components/BrandRail.vue";
useSeoMeta({
  title: "معرفی",
  description: "گسترش سرویس؛ سامانه استعلام وضعیت گارانتی و شرایط برندها",
});
</script>
