<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">دسته‌بندی‌ها</h1>
      <NuxtLink to="/admin/categories/create" class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm">
        <Icon name="ph:plus" /> افزودن دسته‌بندی
      </NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-4" :bordered="false">
      <div class="flex flex-wrap items-center gap-3">
        <n-input v-model:value="q" placeholder="جستجو..." class="w-64" clearable size="large">
          <template #prefix><Icon name="ph:magnifying-glass-duotone" /></template>
        </n-input>
        <n-select v-model:value="parentID" :options="parentOptions" placeholder="والد" class="w-64" clearable />
        <n-switch v-model:value="onlyActive">
          <template #checked>فقط فعال</template>
          <template #unchecked>همه</template>
        </n-switch>
      </div>
    </n-card>

    <n-data-table :columns="columns" :data="items" :loading="pending" :bordered="false" class="rounded-2xl ring-1 ring-slate-200 overflow-hidden" />

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-slate-600">مجموع: {{ total }}</div>
      <div class="flex items-center gap-2">
        <n-button size="small" :disabled="offset===0" @click="prev">قبلی</n-button>
        <n-button size="small" :disabled="offset+limit>=total" @click="next">بعدی</n-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { NButton, NCard, NDataTable, NInput, NSelect, NSwitch } from 'naive-ui'
import { apiDelete, apiGet } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const q = ref('')
const parentID = ref<string | null>(null)
const onlyActive = ref(false)
const limit = ref(10)
const offset = ref(0)
const items = ref<any[]>([])
const total = ref(0)
const pending = ref(false)
const parents = ref<any[]>([])

async function fetchList() {
  pending.value = true
  try {
    const data: any = await apiGet('/categories', {
      params: {
        q: q.value || undefined,
        parentID: parentID.value || undefined,
        isActive: onlyActive.value ? true : undefined,
        limit: limit.value,
        offset: offset.value,
      },
    })
    items.value = Array.isArray(data?.items) ? data.items : []
    total.value = typeof data?.total === 'number' ? data.total : items.value.length
  } finally {
    pending.value = false
  }
}

async function fetchParents() {
  try {
    const data: any = await apiGet('/categories', { params: { limit: 100, offset: 0 } })
    parents.value = Array.isArray(data?.items) ? data.items : []
  } catch {}
}

const parentOptions = computed(() => parents.value.map((p: any) => ({ label: p.name || p.slug || p.id, value: p.id })))

function prev() {
  offset.value = Math.max(0, offset.value - limit.value)
}
function next() {
  if (offset.value + limit.value < total.value) offset.value += limit.value
}

watch([q, parentID, onlyActive, limit, offset], fetchList, { immediate: true })
fetchParents()

function onEdit(row: any) {
  navigateTo(`/admin/categories/${row.id}`)
}

async function onDelete(row: any) {
  if (!confirm('حذف دسته‌بندی؟')) return
  await apiDelete(`/categories/${row.id}`)
  fetchList()
}

const columns = computed(() => [
  { title: 'نام', key: 'name' },
  { title: 'اسلاگ', key: 'slug' },
  { title: 'شناسه والد', key: 'parentID', render: (r: any) => r.parentID ? r.parentID : '—' },
  { title: 'فعال', key: 'isActive', render: (r: any) => (r.isActive ? 'بله' : 'خیر') },
  {
    title: 'عملیات',
    key: 'actions',
    render(row: any) {
      return h(
        'div',
        { class: 'flex items-center gap-2' },
        [
          h(NButton, { size: 'small', onClick: () => onEdit(row) }, { default: () => 'ویرایش' }),
          h(NButton, { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) }, { default: () => 'حذف' }),
        ]
      )
    },
  },
])
</script>

