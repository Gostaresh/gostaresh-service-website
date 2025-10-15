<template>
  <NuxtLink :to="`/products/${product.slug}`" class="group block rounded-2xl bg-white/90 ring-1 ring-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
    <div class="aspect-[4/3] w-full bg-slate-100">
      <img v-if="cover" :src="cover" :alt="product.title" class="h-full w-full object-cover" />
    </div>
    <div class="p-3 space-y-1">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="truncate">{{ product.brandSlug.toUpperCase() }}</span>
        <span class="ms-auto"><PriceChip :text="priceText" /></span>
      </div>
      <h3 class="font-semibold text-slate-800 line-clamp-2">{{ product.title }}</h3>
      <p class="text-xs text-slate-500 line-clamp-2">{{ product.summary }}</p>
    </div>
  </NuxtLink>
  
</template>

<script setup lang="ts">
import type { Product } from '@/types/product'
import { computed } from 'vue'
import { formatToman } from '@/utils/products'
import PriceChip from '@/components/Product/PriceChip.vue'

const props = defineProps<{ product: Product }>()

const cover = computed(() => props.product.gallery?.[0])
const priceText = computed(() => formatToman(props.product.priceToman))
</script>

