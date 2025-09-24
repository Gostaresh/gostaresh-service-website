<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
      overlayHero
        ? 'bg-transparent backdrop-blur-0 border-transparent shadow-none'
        : 'bg-white/80 backdrop-blur border-b shadow-sm',
    ]"
    dir="rtl"
  >
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="group flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2"
        :class="
          overlayHero
            ? 'focus-visible:ring-white/40'
            : 'focus-visible:ring-sky-500/40'
        "
      >
        <img
          src="/images/brands/gs-warranty-logo.png"
          alt="لوگوی گسترش سرویس"
          class="h-9 w-auto"
        />
        <span
          class="text-sm transition-colors"
          :class="
            overlayHero
              ? 'text-white/90 group-hover:text-white'
              : 'text-slate-600 group-hover:text-sky-600'
          "
        >
          گسترش سرویس — همیشه یک قدم جلوتر
        </span>
      </NuxtLink>

      <!-- دسکتاپ -->
      <nav aria-label="ناوبری اصلی" class="hidden md:flex items-center gap-1">
        <NuxtLink :class="[linkBase, activeClass('/')]" to="/">معرفی</NuxtLink>
        <NuxtLink
          :class="[linkBase, activeClass('/warranty/check')]"
          to="/warranty/check"
          >استعلام</NuxtLink
        >
        <NuxtLink
          :class="[linkBase, activeClass('/warranty/policies')]"
          to="/warranty/policies"
          >شرایط گارانتی</NuxtLink
        >
        <NuxtLink
          :class="[linkBase, activeClass('/education')]"
          to="/education"
          >آموزش</NuxtLink
        >
      </nav>

      <!-- موبایل -->
      <details class="md:hidden">
        <summary
          class="px-3 py-2 rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 transition-colors"
          :class="
            overlayHero
              ? 'text-white hover:bg-white/10 focus-visible:ring-white/40'
              : 'text-slate-700 hover:bg-slate-100 focus-visible:ring-sky-500/40'
          "
        >
          منو
        </summary>
        <div class="mt-2 rounded-xl border bg-white p-2 flex flex-col">
          <NuxtLink :class="[linkBaseSolid, activeClass('/')]" to="/"
            >معرفی</NuxtLink
          >
          <NuxtLink
            :class="[linkBaseSolid, activeClass('/warranty/check')]"
            to="/warranty/check"
            >استعلام</NuxtLink
          >
          <NuxtLink
            :class="[linkBaseSolid, activeClass('/warranty/policies')]"
            to="/warranty/policies"
            >شرایط گارانتی</NuxtLink
          >
          <NuxtLink
            :class="[linkBaseSolid, activeClass('/education')]"
            to="/education"
            >آموزش</NuxtLink
          >
        </div>
      </details>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWindowScroll } from "@vueuse/core";

const route = useRoute();
const { y } = useWindowScroll();

// وقتی دقیقاً بالای صفحه‌ای
const atTop = computed(() => y.value <= 2);

// فقط در صفحه‌ی خانه و وقتی بالاترین نقطه‌ای → هدر شفاف
const overlayHero = computed(() => route.path === "/" && atTop.value);

// کلاس پایه‌ی لینک‌ها (روی بنر سفید می‌شوند)
const linkBase = computed(() =>
  overlayHero.value
    ? "px-3 py-2 rounded-xl transition text-white/90 hover:text-white hover:bg-white/10"
    : "px-3 py-2 rounded-xl transition text-slate-700 hover:text-sky-700 hover:bg-slate-100"
);
// برای منوی موبایل داخل پنل سفید
const linkBaseSolid =
  "px-3 py-2 rounded-xl text-slate-700 hover:text-sky-700 hover:bg-slate-100 transition";

const activeClass = (path: string) =>
  route.path === path
    ? overlayHero.value
      ? "bg-white/10 text-white"
      : "bg-sky-50 text-sky-700"
    : "";
</script>
