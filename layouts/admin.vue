<template>
  <div class="min-h-screen bg-slate-50" dir="rtl">
    <!-- Top bar (mobile) -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur ring-1 ring-slate-200/80 shadow-sm md:hidden">
      <div class="container mx-auto px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100"
          @click="open = !open"
          aria-label="باز کردن منو"
        >
          <Icon name="ph:list-duotone" size="22" />
          <span class="text-sm">منو</span>
        </button>
        <div class="text-sm text-slate-500">پنل مدیریت</div>
      </div>
    </header>

    <div class="mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-[260px,1fr] gap-0">
      <!-- Sidebar -->
      <aside
        :class="[
          'md:sticky md:top-0 md:h-[100dvh] md:block bg-white ring-1 ring-slate-200/80 shadow-sm',
          open ? 'block' : 'hidden',
        ]"
      >
        <div class="flex h-14 items-center justify-between px-4">
          <NuxtLink to="/admin" class="text-sky-600 font-semibold">پنل مدیریت</NuxtLink>
          <button class="md:hidden p-2 rounded-lg hover:bg-slate-100" @click="open = false" aria-label="بستن">
            <Icon name="ph:x-duotone" size="18" />
          </button>
        </div>
        <div class="px-3 pb-3">
          <div class="px-3 py-2 text-xs text-slate-400">داده‌ها</div>
          <nav class="space-y-1">
            <NuxtLink
              to="/admin"
              class="nav-item"
              :class="isActive('/') ? 'is-active' : ''"
            >
              <Icon name="ph:gauge-duotone" /> داشبورد
            </NuxtLink>
            <NuxtLink
              v-for="d in datasets"
              :key="d.key"
              :to="{ path: `/admin/${d.key}` }"
              class="nav-item"
              :class="isActive(`/${d.key}`) ? 'is-active' : ''"
            >
              <Icon name="ph:database-duotone" /> {{ d.title }}
            </NuxtLink>
          </nav>
        </div>
        <div class="mt-auto hidden md:block p-3 text-[11px] text-slate-400">
          Read‑Only • Nuxt 4
        </div>
      </aside>

      <!-- Content -->
      <main class="min-h-[calc(100dvh-56px)] md:min-h-screen">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminDatasets } from '@/utils/admin-datasets'

const datasets = adminDatasets
const open = ref(false)
const route = useRoute()

const isActive = (suffix: string) => {
  // route.path starts with /admin
  return route.path === `/admin${suffix}`
}
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition;
}
.nav-item.is-active {
  @apply bg-sky-50 text-sky-700 ring-1 ring-sky-200;
}
</style>

