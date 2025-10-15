<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">{{ brand?.name || 'برند' }}</h1>
      <p v-if="brand?.summary" class="text-slate-600 mt-1">{{ brand?.summary }}</p>
      <div v-if="brand?.tags?.length" class="mt-2 flex flex-wrap gap-2">
        <span v-for="t in brand?.tags" :key="t" class="rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-600">#{{ t }}</span>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <div v-if="!products.length" class="text-slate-500">محصولی برای این برند یافت نشد.</div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ProductCard from '@/components/Product/ProductCard.vue'
import type { Brand } from '@/types/brand'
import { getProductsByBrand } from '@/utils/products'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = String(route.params.slug || '')
const products = await getProductsByBrand(slug)
let brand: Brand | null = null
try {
  const list = (await import('@/public/data/brands.json')).default as Brand[]
  brand = list.find((b) => (b.slug || b.name.toLowerCase().replace(/\s+/g, '-')) === slug) || null
} catch {}
</script>

