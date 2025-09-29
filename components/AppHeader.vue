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
          گسترش سرویس
        </span>
      </NuxtLink>

      <!-- دسکتاپ -->
      <nav aria-label="ناوبری اصلی" class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="[linkBase, activeClass(link.to)]"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- موبایل -->
      <button
        type="button"
        class="md:hidden inline-flex items-center justify-center rounded-xl px-3 py-2 focus:outline-none focus-visible:ring-2 transition-colors"
        :class="
          overlayHero
            ? 'text-white hover:bg-white/10 focus-visible:ring-white/40'
            : 'text-slate-700 hover:bg-slate-100 focus-visible:ring-sky-500/40'
        "
        @click="openMobile()"
        aria-label="باز کردن منو"
      >
        <Icon name="ph:list" size="24" />
      </button>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileOpen"
          class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          @click="closeMobile()"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-200"
        leave-active-class="transition-transform duration-200"
        enter-from-class="translate-x-full"
        leave-to-class="translate-x-full"
      >
        <nav
          v-if="mobileOpen"
          class="fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-white shadow-xl md:hidden flex flex-col gap-6 p-6"
          dir="rtl"
          aria-label="منوی موبایل"
          @click.stop
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-500">منوی اصلی</span>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              @click="closeMobile()"
              aria-label="بستن منو"
            >
              <Icon name="ph:x" size="22" />
            </button>
          </div>

          <ul class="flex flex-col gap-2">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                :class="mobileLinkClass(link.to)"
                @click="closeMobile()"
              >
                <span>{{ link.label }}</span>
                <Icon name="ph:caret-left" size="16" class="text-slate-400" />
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useWindowScroll } from "@vueuse/core";

type NavLink = { to: string; label: string };

const navLinks: NavLink[] = [
  { to: "/", label: "خانه" },
  { to: "/warranty/check", label: "استعلام" },
  { to: "/warranty/policies", label: "شرایط گارانتی" },
  { to: "/representatives", label: "نمایندگی‌ها" },
  { to: "/education", label: "آموزش" },
];

const route = useRoute();
const { y } = useWindowScroll();

const atTop = computed(() => y.value <= 2);
const overlayHero = computed(() => route.path === "/" && atTop.value);

const linkBase = computed(() =>
  overlayHero.value
    ? "px-3 py-2 rounded-xl transition text-white/90 hover:text-white hover:bg-white/10"
    : "px-3 py-2 rounded-xl transition text-slate-700 hover:text-sky-700 hover:bg-slate-100"
);

const activeClass = (path: string) =>
  route.path === path
    ? overlayHero.value
      ? "bg-white/10 text-white"
      : "bg-sky-50 text-sky-700"
    : "";

const mobileOpen = ref(false);

const openMobile = () => (mobileOpen.value = true);
const closeMobile = () => (mobileOpen.value = false);

watch(
  () => route.path,
  () => closeMobile()
);

const mobileLinkClass = (path: string) =>
  [
    "flex items-center justify-between rounded-xl px-4 py-2 text-base font-medium transition",
    route.path === path
      ? "bg-sky-50 text-sky-700"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ");
</script>


