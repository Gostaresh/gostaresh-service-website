<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5">
      <h1 class="text-2xl font-bold">{{ parentSlug }} / {{ childSlug }}</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <div v-if="!products.length" class="text-slate-500">محصولی در این دسته یافت نشد.</div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ProductCard from '@/components/Product/ProductCard.vue'
import { getProductsByCategory } from '@/utils/products'

definePageMeta({ layout: 'default' })

const route = useRoute()
const parentSlug = String(route.params.parent || '')
const childSlug = String(route.params.child || '')
const products = await getProductsByCategory(parentSlug, childSlug)
</script>

