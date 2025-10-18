<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <!-- Sidebar Filters -->
      <aside class="lg:sticky lg:top-24 h-fit">
        <div class="rounded-2xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700">فیلترها</h3>
            <button
              type="button"
              class="text-xs text-sky-600 hover:text-sky-700"
              @click="clearFilters"
            >
              پاک‌سازی
            </button>
          </div>

          <!-- جستجو عمومی -->
          <div class="mb-4">
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
          </div>

          <!-- بخش برند -->
          <div class="border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
            <button type="button" class="flex w-full items-center justify-between text-right" @click="open.brand = !open.brand">
              <span class="text-sm font-medium text-slate-700">برند</span>
              <Icon :name="open.brand ? 'ph:caret-up-duotone' : 'ph:caret-down-duotone'" />
            </button>
            <div v-show="open.brand" class="mt-3 space-y-3">
              <n-input v-model:value="brandQ" placeholder="جستجو برند ..." clearable size="large">
                <template #prefix>
                  <Icon name="ph:magnifying-glass-duotone" />
                </template>
              </n-input>
              <n-checkbox-group v-model:value="selectedBrands">
                <div class="max-h-64 overflow-auto pr-1">
                  <div
                    v-for="b in filteredBrands"
                    :key="b.slug || b.name"
                    class="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-b-0"
                  >
                    <span class="text-xs text-slate-500">{{ b.nameEn || b.slug || b.name }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-slate-700">{{ b.name }}</span>
                      <n-checkbox :value="b.slug || b.name.toLowerCase().replace(/\s+/g, '-')" />
                    </div>
                  </div>
                </div>
              </n-checkbox-group>
            </div>
          </div>

          <!-- بخش دسته‌بندی -->
          <div class="border-t border-slate-200 pt-3">
            <button type="button" class="flex w-full items-center justify-between text-right" @click="open.category = !open.category">
              <span class="text-sm font-medium text-slate-700">دسته‌بندی</span>
              <Icon :name="open.category ? 'ph:caret-up-duotone' : 'ph:caret-down-duotone'" />
            </button>
            <div v-show="open.category" class="mt-3 space-y-3">
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

          <!-- بخش قیمت -->
          <div class="border-t border-slate-200 pt-3">
            <button type="button" class="flex w-full items-center justify-between text-right" @click="open.price = !open.price">
              <span class="text-sm font-medium text-slate-700">محدوده قیمت</span>
              <Icon :name="open.price ? 'ph:caret-up-duotone' : 'ph:caret-down-duotone'" />
            </button>
            <div v-show="open.price" class="mt-4">
              <n-slider v-model:value="priceRange" range :min="priceMin" :max="priceMax" :step="priceStep" />
              <div class="mt-2 flex items-center justify-between text-xs text-slate-600">
                <span>{{ formatToman(priceRange[0]) }}</span>
                <span>{{ formatToman(priceRange[1]) }}</span>
              </div>
            </div>
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
import { computed, ref, watchEffect, reactive } from 'vue'
import { NInput, NSelect, NCheckbox, NCheckboxGroup, NSlider } from 'naive-ui'
import ProductCard from '@/components/Product/ProductCard.vue'
import type { Product } from '@/types/product'
import type { Brand } from '@/types/brand'
import { getProducts, formatToman } from '@/utils/products'
import { getParentCategories, getChildCategories } from '@/utils/categories'

definePageMeta({ layout: 'default' })

const products = ref<Product[]>([])
const open = reactive({ brand: true, category: true, price: true })
const brands = ref<Brand[]>([])
const brandQ = ref('')
const selectedBrands = ref<string[]>([])
const q = ref('')
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
const filteredBrands = computed(() => {
  const q = norm(brandQ.value)
  return brands.value
    .map((b) => ({ ...b, slug: b.slug || b.name.toLowerCase().replace(/\s+/g, '-') }))
    .filter((b) => !q || [b.name, b.slug].join(' ').toLowerCase().includes(q))
})

const priceMin = ref(0)
const priceMax = ref(0)
const priceStep = 50000
const priceRange = ref<[number, number]>([0, 0])

watchEffect(() => {
  if (!products.value.length) return
  const prices = products.value.map((p) => p.priceToman)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  priceMin.value = min
  priceMax.value = max
  if (priceRange.value[0] === 0 && priceRange.value[1] === 0) {
    priceRange.value = [min, max]
  }
})
const filtered = computed(() => {
  const query = norm(q.value)
  const bList = selectedBrands.value
  const p = parent.value || ''
  const c = child.value || ''
  return products.value.filter((item) => {
    const matchesQ = !query || JSON.stringify(item).toLowerCase().includes(query)
    const matchesB = !bList.length || bList.includes(item.brandSlug)
    const matchesP = !p || item.parentCategory === p
    const matchesC = !c || item.childCategory === c
    const matchesPrice = item.priceToman >= priceRange.value[0] && item.priceToman <= priceRange.value[1]
    return matchesQ && matchesB && matchesP && matchesC && matchesPrice
  })
})

const clearFilters = () => {
  q.value = ''
  selectedBrands.value = []
  parent.value = null
  child.value = null
  brandQ.value = ''
  if (priceMin.value || priceMax.value) priceRange.value = [priceMin.value, priceMax.value]
}
</script>
