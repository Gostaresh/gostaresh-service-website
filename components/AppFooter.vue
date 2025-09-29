<template>
  <footer class="border-t bg-white">
    <div
      class="container mx-auto px-4 py-6 text-sm text-slate-600 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      dir="rtl"
    >
      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink to="/about" class="hover:text-sky-600 transition">درباره ما</NuxtLink>
        <NuxtLink to="/representatives" class="hover:text-sky-600 transition">نمایندگی‌ها</NuxtLink>
        <NuxtLink to="/education" class="hover:text-sky-600 transition">آموزش</NuxtLink>
      </div>
      <div class="flex flex-col gap-1 text-xs text-slate-500 md:text-right">
        <span>سایت گسترش سرویس: gsiran.ir</span>
        <span>سامانه خدمات پس از فروش: service.gsiran.ir</span>
      </div>
    </div>
  </footer>
</template>
