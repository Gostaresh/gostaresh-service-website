<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <h1 class="text-2xl font-bold mb-4">دسته‌بندی‌ها</h1>
    <div class="grid gap-4 md:grid-cols-2">
      <div v-for="p in parents" :key="p.slug" class="rounded-2xl bg-white/90 ring-1 ring-slate-200 shadow-sm p-4">
        <div class="flex items-center gap-3">
          <img v-if="p.image" :src="p.image" class="h-10 w-10 rounded" alt="" />
          <div>
            <h2 class="font-semibold">{{ p.title }}</h2>
            <p class="text-slate-600 text-sm">{{ p.summary }}</p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <NuxtLink
            v-for="c in children[p.slug] || []"
            :key="c.slug"
            :to="{ path: `/categories/${p.slug}/${c.slug}` }"
            class="rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
          >
            {{ c.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getParentCategories, getChildCategories } from '@/utils/categories'

definePageMeta({ layout: 'default' })

const parents = await getParentCategories()
const children: Record<string, Awaited<ReturnType<typeof getChildCategories>>> = {}
for (const p of parents) {
  children[p.slug] = await getChildCategories(p.slug)
}
</script>

