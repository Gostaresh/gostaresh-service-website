<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <!-- Sidebar Filters -->
      <aside class="lg:sticky lg:top-24 h-fit">
        <div class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700">جستجو و فیلتر</h3>
            <button
              type="button"
              class="text-xs text-sky-600 hover:text-sky-700"
              @click="clearFilters"
            >
              پاک‌سازی
            </button>
          </div>
          <div class="space-y-3">
            <n-input
              v-model:value="q"
              placeholder="جستجوی نام/تگ/ویژگی..."
              clearable
              size="large"
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass-duotone" />
              </template>
            </n-input>

            <n-select
              v-model:value="brand"
              :options="brandOptions"
              placeholder="برند"
              clearable
              size="large"
            />

            <n-select
              v-model:value="parent"
              :options="parentOptions"
              placeholder="دسته اصلی"
              clearable
              size="large"
            />

            <n-select
              v-model:value="child"
              :options="childOptions"
              placeholder="زیر دسته"
              clearable
              size="large"
              :disabled="!parent"
            />
          </div>
        </div>
      </aside>

      <!-- Products Grid -->
      <main>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
        </div>

        <div v-if="!filtered.length" class="mt-6 text-slate-500">محصولی یافت نشد.</div>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { NInput, NSelect } from 'naive-ui'
import ProductCard from '@/components/Product/ProductCard.vue'
import type { Product } from '@/types/product'
import type { Brand } from '@/types/brand'
import { getProducts } from '@/utils/products'
import { getParentCategories, getChildCategories } from '@/utils/categories'

definePageMeta({ layout: 'default' })

const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const q = ref('')
const brand = ref<string | null>(null)
const parent = ref<string | null>(null)
const child = ref<string | null>(null)

const brandOptions = computed(() => brands.value.map((b) => ({ label: b.name, value: b.slug || b.name.toLowerCase().replace(/\s+/g, '-') })))

const parentList = ref(await getParentCategories())
const parentOptions = computed(() => parentList.value.map((p) => ({ label: p.title, value: p.slug })))
const childOptions = ref<{ label: string; value: string }[]>([])

watchEffect(async () => {
  const data = (await import('@/public/data/brands.json')).default as Brand[]
  brands.value = data
})

watchEffect(async () => {
  products.value = await getProducts()
})

watchEffect(async () => {
  if (!parent.value) {
    child.value = null
    childOptions.value = []
    return
  }
  const list = await getChildCategories(parent.value)
  childOptions.value = list.map((c) => ({ label: c.title, value: c.slug }))
})

const norm = (s: string) => s?.toLowerCase()?.trim() || ''
const filtered = computed(() => {
  const query = norm(q.value)
  const b = brand.value || ''
  const p = parent.value || ''
  const c = child.value || ''
  return products.value.filter((item) => {
    const matchesQ = !query || JSON.stringify(item).toLowerCase().includes(query)
    const matchesB = !b || item.brandSlug === b
    const matchesP = !p || item.parentCategory === p
    const matchesC = !c || item.childCategory === c
    return matchesQ && matchesB && matchesP && matchesC
  })
})

const clearFilters = () => {
  q.value = ''
  brand.value = null
  parent.value = null
  child.value = null
}
</script>
