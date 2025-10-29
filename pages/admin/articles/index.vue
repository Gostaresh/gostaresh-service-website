<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">مقالات</h1>
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/articles/types" class="text-sky-600 hover:underline text-sm">مدیریت نوع مقالات</NuxtLink>
        <NuxtLink to="/admin/articles/create" class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm">
          <Icon name="ph:plus" /> افزودن مقاله
        </NuxtLink>
      </div>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-4" :bordered="false">
      <div class="flex flex-wrap items-center gap-3">
        <n-input v-model:value="q" placeholder="جستجو..." class="w-64" clearable size="large">
          <template #prefix><Icon name="ph:magnifying-glass-duotone" /></template>
        </n-input>
        <n-select v-model:value="articleTypeID" :options="typeOptions" placeholder="نوع" class="w-52" clearable />
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
const articleTypeID = ref<string | null>(null)
const onlyActive = ref(false)
const limit = ref(10)
const offset = ref(0)
const items = ref<any[]>([])
const total = ref(0)
const pending = ref(false)
const types = ref<any[]>([])

async function fetchList() {
  pending.value = true
  try {
    const data: any = await apiGet('/articles', {
      params: { q: q.value || undefined, articleTypeID: articleTypeID.value || undefined, isActive: onlyActive.value ? true : undefined, limit: limit.value, offset: offset.value },
    })
    items.value = Array.isArray(data?.items) ? data.items : []
    total.value = typeof data?.total === 'number' ? data.total : items.value.length
  } finally { pending.value = false }
}

async function fetchTypes() {
  try { types.value = await apiGet('/articles/types') as any[] } catch { types.value = [] }
}

const typeOptions = computed(() => types.value.map((t: any) => ({ label: t.name || t.id, value: t.id })))

function prev() { offset.value = Math.max(0, offset.value - limit.value) }
function next() { if (offset.value + limit.value < total.value) offset.value += limit.value }

watch([q, articleTypeID, onlyActive, limit, offset], fetchList, { immediate: true })
fetchTypes()

function onEdit(row: any) { navigateTo(`/admin/articles/${row.id}`) }
async function onDelete(row: any) { if (!confirm('حذف مقاله؟')) return; await apiDelete(`/articles/${row.id}`); fetchList() }

const columns = computed(() => [
  { title: 'عنوان', key: 'title' },
  { title: 'اسلاگ', key: 'slug' },
  { title: 'نوع', key: 'articleTypeID' },
  { title: 'فعال', key: 'isActive', render: (r: any) => (r.isActive ? 'بله' : 'خیر') },
  { title: 'عملیات', key: 'actions', render(row: any) { return h('div', { class: 'flex items-center gap-2' }, [ h(NButton, { size: 'small', onClick: () => onEdit(row) }, { default: () => 'ویرایش' }), h(NButton, { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) }, { default: () => 'حذف' }) ]) } },
])
</script>

