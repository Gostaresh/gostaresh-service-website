<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center gap-3">
      <NuxtLink to="/admin" class="inline-flex items-center gap-1 text-sky-600 hover:underline text-sm">
        <Icon name="ph:arrow-right" /> بازگشت
      </NuxtLink>
      <h1 class="text-xl font-bold">{{ meta?.title || 'دیتا' }}</h1>
      <n-tag type="warning" round size="small" class="bg-amber-400/10 text-amber-700">نمایشی</n-tag>
      <n-tag v-if="meta" round size="small" class="bg-slate-100 text-slate-600">{{ meta.file }}</n-tag>
    </div>

    <div v-if="!meta" class="text-slate-500">دیتاست مورد نظر یافت نشد.</div>

    <template v-else>
      <n-card :bordered="false" class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-4">
        <div class="flex flex-wrap items-center gap-3">
          <n-input v-model:value="q" placeholder="جستجو..." class="w-64" clearable size="large">
            <template #prefix>
              <Icon name="ph:magnifying-glass-duotone" />
            </template>
          </n-input>
          <n-tag v-if="loaded && meta.type === 'array'" type="info" round size="small" class="bg-sky-500/10 text-sky-700">
            تعداد: {{ toFa(items.length) }}
          </n-tag>
        </div>
      </n-card>

      <template v-if="pending">
        <n-skeleton text :repeat="6" />
      </template>

      <template v-else>
        <div v-if="meta.type === 'array'">
          <div class="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
            <table class="min-w-full text-sm">
              <thead class="bg-slate-50">
                <tr>
                  <th v-for="c in displayColumns" :key="c" class="px-3 py-2 text-right font-semibold text-slate-700">
                    {{ c }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in filtered" :key="idx" class="border-t border-slate-100">
                  <td v-for="c in displayColumns" :key="c" class="px-3 py-2 align-top">
                    <template v-if="isImageField(c) && typeof row[c] === 'string'">
                      <img :src="row[c] as string" alt="" class="h-10 w-auto rounded" />
                    </template>
                    <template v-else>
                      {{ formatCell(row[c]) }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else>
          <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm">
            <div v-if="objKeys.length" class="grid gap-3 md:grid-cols-2">
              <div v-for="k in objKeys" :key="k" class="rounded-xl bg-white/70 p-3">
                <div class="text-xs text-slate-500 mb-1">{{ k }}</div>
                <div class="text-sm text-slate-700 break-words">
                  <template v-if="isImageField(k) && typeof objectData[k] === 'string'">
                    <img :src="objectData[k] as string" alt="" class="h-12 w-auto rounded" />
                  </template>
                  <template v-else>
                    {{ formatCell(objectData[k]) }}
                  </template>
                </div>
              </div>
            </div>
            <div v-else class="text-slate-500">داده‌ای یافت نشد.</div>
          </n-card>
        </div>
      </template>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NCard, NInput, NSkeleton, NTag } from 'naive-ui'
import { adminDatasets, findDataset } from '@/utils/admin-datasets'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const key = computed(() => String(route.params.resource || ''))
const meta = computed(() => findDataset(key.value))

const q = ref('')

const { data, pending } = await useAsyncData(
  () => `admin-data:${meta.value?.key || 'unknown'}`,
  async () => {
    if (!meta.value) return null
    try {
      return await $fetch(meta.value.file)
    } catch {
      return null
    }
  },
  { watch: [meta] }
)

const loaded = computed(() => !pending.value && data.value !== null)

// Array view
const items = computed<any[]>(() => (Array.isArray(data.value) ? (data.value as any[]) : []))

const suggestedColumns = computed<string[]>(() => meta.value?.columns || [])
const inferredColumns = computed<string[]>(() => {
  if (!items.value.length) return []
  const sample = items.value.slice(0, 5)
  const set = new Set<string>()
  sample.forEach((it) => Object.keys(it || {}).forEach((k) => set.add(k)))
  return Array.from(set)
})
const displayColumns = computed<string[]>(() => {
  const sug = suggestedColumns.value
  if (sug.length) return sug
  return inferredColumns.value
})

const norm = (s: string) => s.toLowerCase().trim()
const filtered = computed(() => {
  const s = norm(q.value || '')
  if (!s) return items.value
  return items.value.filter((row) => JSON.stringify(row).toLowerCase().includes(s))
})

// Object view
const objectData = computed<Record<string, any>>(() => {
  if (Array.isArray(data.value) || !data.value) return {}
  return data.value as Record<string, any>
})
const objKeys = computed(() => Object.keys(objectData.value))

const isImageField = (name: string) => /^(image|logo)$/i.test(name)
const formatCell = (v: any): string => {
  if (v == null) return ''
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) {
    if (v.length && (typeof v[0] === 'string' || typeof v[0] === 'number')) return v.join(', ')
    return `Array(${v.length})`
  }
  if (typeof v === 'object') {
    // duration special-case
    if (typeof v.value === 'number' && typeof v.unit === 'string') {
      return `${v.value} ${v.unit}`
    }
    try {
      return JSON.stringify(v)
    } catch {
      return '[Object]'
    }
  }
  return String(v)
}

const toFa = (source: number | string) => String(source).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

</script>
