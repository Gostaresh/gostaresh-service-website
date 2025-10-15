<template>
  <section class="container mx-auto px-4 py-10" dir="rtl">
    <div class="mb-6 flex flex-col gap-2 text-center">
      <h2 class="text-xl font-bold text-slate-800">محصولات ویژه</h2>
      <p class="text-sm text-slate-500">گزیده‌ای از محصولات منتخب</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard v-for="p in items" :key="p.id" :product="p" />
    </div>
    <div class="mt-6 flex justify-center">
      <NuxtLink to="/products" class="inline-flex items-center gap-2 rounded-full border border-sky-500 px-5 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50 transition">
        مشاهده همه محصولات
        <Icon name="ph:arrow-left" size="16" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/Product/ProductCard.vue'
import type { Product } from '@/types/product'
import { getFeaturedProducts } from '@/utils/products'

const items = ref<Product[]>([])

onMounted(async () => {
  items.value = await getFeaturedProducts(6)
})
</script>

