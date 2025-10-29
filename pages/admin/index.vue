<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-6 flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">داشبورد ادمین</h1>
        <p class="text-slate-500 text-sm mt-1">نمای کلی از داده‌های سیستم</p>
      </div>
      <n-tag :type="apiHealthy ? 'success' : 'error'" round>
        {{ apiHealthy ? 'API Online' : 'API Offline' }}
      </n-tag>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <n-card v-for="card in cards" :key="card.key" size="small" class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="text-slate-700 font-medium">{{ card.title }}</div>
            <NuxtLink :to="card.to" class="text-xs text-sky-600 hover:underline">مدیریت</NuxtLink>
          </div>
        </template>
        <div class="text-3xl font-bold text-slate-800">
          <template v-if="loading[card.key]"><n-skeleton text style="width: 60%" /></template>
          <template v-else>{{ counts[card.key] ?? 0 }}</template>
        </div>
      </n-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { NCard, NSkeleton, NTag } from 'naive-ui'
import { apiGet } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const counts = reactive<Record<string, number>>({})
const loading = reactive<Record<string, boolean>>({})
const apiHealthy = ref<boolean>(true)

const cards = [
  { key: 'products', title: 'محصولات', to: '/admin/products' },
  { key: 'brands', title: 'برندها', to: '/admin/brands' },
  { key: 'categories', title: 'دسته‌بندی‌ها', to: '/admin/categories' },
  { key: 'articles', title: 'مقالات', to: '/admin/articles' },
  { key: 'users', title: 'کاربران', to: '/admin/users' },
  { key: 'website-settings', title: 'تنظیمات سایت', to: '/admin/website-settings' },
]

onMounted(async () => {
  apiHealthy.value = await ping()
  await Promise.all(cards.map((c) => fetchCount(c.key)))
})

async function ping(): Promise<boolean> {
  try {
    await apiGet('/product-statuses')
    return true
  } catch {
    return false
  }
}

async function fetchCount(key: string) {
  loading[key] = true
  try {
    const url =
      key === 'website-settings'
        ? '/website-settings'
        : key === 'users'
        ? '/users'
        : key === 'articles'
        ? '/articles'
        : `/${key}`
    const data: any = await apiGet(url, { params: { limit: 1, offset: 0 } })
    const total = typeof data?.total === 'number' ? data.total : Array.isArray(data?.items) ? data.items.length : 0
    counts[key] = total
  } catch {
    counts[key] = 0
  } finally {
    loading[key] = false
  }
}
</script>

