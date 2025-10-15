<template>
  <section class="container mx-auto px-4 py-8" dir="rtl" v-if="product">
    <div class="grid gap-6 md:grid-cols-2">
      <ProductGallery :images="product.gallery" />
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-slate-800">{{ product.title }}</h1>
          <PriceChip :text="priceText" />
        </div>
        <div class="text-slate-500 text-sm">برند: {{ product.brandSlug.toUpperCase() }} | دسته: {{ product.parentCategory }} / {{ product.childCategory }}</div>
        <p class="text-slate-700">{{ product.summary }}</p>
        <div v-html="product.description" class="prose prose-slate max-w-none rtl:prose-p:text-right"></div>
        <div>
          <h2 class="font-semibold mb-2">ویژگی‌ها</h2>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li v-for="(f, i) in product.features" :key="i" class="rounded-xl bg-white/90 ring-1 ring-slate-200 px-3 py-2">
              <b class="text-slate-700">{{ f.key }}:</b> <span class="text-slate-600">{{ f.value }}</span>
            </li>
          </ul>
        </div>
        <div v-if="product.tags?.length">
          <h2 class="font-semibold mb-2">تگ‌ها</h2>
          <div class="flex flex-wrap gap-2">
            <span v-for="t in product.tags" :key="t" class="rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-600">#{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="container mx-auto px-4 py-8 text-slate-500">محصول یافت نشد.</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findProduct, formatToman } from '@/utils/products'
import ProductGallery from '@/components/Product/ProductGallery.vue'
import PriceChip from '@/components/Product/PriceChip.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = String(route.params.slug || '')
const product = await findProduct(slug)
const priceText = computed(() => (product ? formatToman(product.priceToman) : ''))
</script>

