<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-6 flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">داشبورد مدیریت</h1>
        <p class="text-slate-500 text-sm mt-1">مرور سریع وضعیت بخش‌های مختلف</p>
      </div>
      <n-tag :type="apiHealthy ? 'success' : 'error'" round>
        {{ apiHealthy ? 'API Online' : 'API Offline' }}
      </n-tag>
    </div>

    <div v-if="cards.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <n-card
        v-for="card in cards"
        :key="card.key"
        size="small"
        class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="text-slate-700 font-medium">{{ card.title }}</div>
            <NuxtLink :to="card.to" class="text-xs text-sky-600 hover:underline">مشاهده</NuxtLink>
          </div>
        </template>
        <div class="text-3xl font-bold text-slate-800">
          <template v-if="loading[card.key]"><n-skeleton text style="width: 60%" /></template>
          <template v-else>{{ counts[card.key] ?? 0 }}</template>
        </div>
      </n-card>
    </div>
    <div v-else class="text-center text-sm text-slate-500 mt-6">دسترسی برای مشاهده هیچ بخشی فعال نیست.</div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { NCard, NSkeleton, NTag } from 'naive-ui'
import { apiGet } from '@/utils/api'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permissions'],
  permissions: {
    any: ['product.read', 'brand.read', 'category.read', 'article.read', 'user.read', 'website_setting.read'],
  },
})

const counts = reactive<Record<string, number>>({})
const loading = reactive<Record<string, boolean>>({})
const apiHealthy = ref<boolean>(true)

const { hasPerm } = useAccess()

const CARD_CONFIG = [
  { key: 'products', title: 'محصولات', to: '/admin/products', perm: 'product.read' },
  { key: 'brands', title: 'برندها', to: '/admin/brands', perm: 'brand.read' },
  { key: 'categories', title: 'دسته‌بندی‌ها', to: '/admin/categories', perm: 'category.read' },
  { key: 'articles', title: 'مقالات', to: '/admin/articles', perm: 'article.read' },
  { key: 'users', title: 'کاربران', to: '/admin/users', perm: 'user.read' },
  { key: 'website-settings', title: 'تنظیمات سایت', to: '/admin/website-settings', perm: 'website_setting.read' },
]

const cards = computed(() => CARD_CONFIG.filter((card) => hasPerm(card.perm)))

onMounted(async () => {
  apiHealthy.value = await ping()
  const visibleCards = cards.value
  await Promise.all(visibleCards.map((c) => fetchCount(c.key)))
})

async function ping(): Promise<boolean> {
  const checks = [
    { perm: 'product_status.read', url: '/product-statuses' as const },
    { perm: 'product.read', url: '/products' as const },
    { perm: 'website_setting.read', url: '/website-settings' as const },
  ]
  const target = checks.find((check) => hasPerm(check.perm))
  if (!target) {
    return true
  }

  try {
    if (target.url === '/product-statuses') {
      await apiGet(target.url)
    } else {
      await apiGet(target.url, { params: { limit: 1, offset: 0 } })
    }
    return true
  } catch {
    return false
  }
}

async function fetchCount(key: string) {
  loading[key] = true
  try {
    const config =
      CARD_CONFIG.find((card) => card.key === key) ??
      ({ key: 'products', perm: 'product.read', to: '/admin/products' } as (typeof CARD_CONFIG)[number])
    if (!hasPerm(config.perm)) {
      counts[key] = 0
      return
    }
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
