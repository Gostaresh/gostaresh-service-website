<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex flex-wrap items-center gap-2">
      <n-input v-model:value="q" placeholder="جستجوی نام/تگ/ویژگی..." class="w-64" clearable size="large">
        <template #prefix><Icon name="ph:magnifying-glass-duotone" /></template>
      </n-input>
      <n-select v-model:value="brand" :options="brandOptions" placeholder="برند" clearable size="large" />
      <n-select v-model:value="parent" :options="parentOptions" placeholder="دسته مادر" clearable size="large" />
      <n-select v-model:value="child" :options="childOptions" placeholder="دسته فرزند" clearable size="large" :disabled="!parent" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
    </div>

    <div v-if="!filtered.length" class="text-slate-500">محصولی یافت نشد.</div>
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
</script>


