<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-6 flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">پنل مدیریت (نمایشی)</h1>
        <p class="text-slate-500 text-sm mt-1">
          این پنل فقط برای مشاهده داده‌هاست. ذخیره‌سازی غیرفعال است و بعداً به بک‌اند متصل می‌شود.
        </p>
      </div>
      <n-tag type="warning" round class="bg-amber-400/10 text-amber-700">Read-Only</n-tag>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <n-card
        v-for="d in datasets"
        :key="d.key"
        :title="d.title"
        size="small"
        class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm"
      >
        <template #default>
          <div class="space-y-2">
            <p v-if="d.description" class="text-xs text-slate-500">{{ d.description }}</p>
            <div class="text-sm text-slate-600">
              <template v-if="loading[d.key]">
                <n-skeleton text :repeat="1" style="width: 60%" />
              </template>
              <template v-else>
                <span v-if="d.type === 'array'">تعداد آیتم‌ها: <b>{{ counts[d.key] ?? 0 }}</b></span>
                <span v-else>نوع: آبجکت</span>
              </template>
            </div>
            <div class="pt-1">
              <NuxtLink
                :to="{ path: `/admin/${d.key}` }"
                class="inline-flex items-center gap-2 rounded-xl border border-sky-500 text-sky-600 px-3 py-1.5 text-xs hover:bg-sky-50 transition"
              >
                مشاهده
                <Icon name="ph:arrow-left" />
              </NuxtLink>
            </div>
          </div>
        </template>
      </n-card>
    </div>
  </section>
  
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { NCard, NSkeleton, NTag } from 'naive-ui'
import { adminDatasets } from '@/utils/admin-datasets'

definePageMeta({ layout: 'admin' })

const datasets = adminDatasets
const counts = reactive<Record<string, number>>({})
const loading = reactive<Record<string, boolean>>({})

onMounted(async () => {
  await Promise.all(
    datasets.map(async (d) => {
      loading[d.key] = true
      try {
        const data = await $fetch(d.file)
        if (d.type === 'array' && Array.isArray(data)) {
          counts[d.key] = data.length
        }
      } catch {
        // ignore in demo
      } finally {
        loading[d.key] = false
      }
    })
  )
})
</script>
