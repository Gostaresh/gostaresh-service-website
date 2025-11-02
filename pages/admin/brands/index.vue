<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">برندها</h1>
      <NuxtLink
        v-if="hasPerm('brand.create')"
        to="/admin/brands/create"
        class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm"
      >
        <Icon name="ph:plus" /> افزودن برند
      </NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-4" :bordered="false">
      <div class="flex flex-wrap items-center gap-3">
        <n-input v-model:value="q" placeholder="جستجو..." class="w-64" clearable size="large">
          <template #prefix><Icon name="ph:magnifying-glass-duotone" /></template>
        </n-input>
      </div>
    </n-card>

    <n-data-table
      :columns="columns"
      :data="items"
      :loading="pending"
      :bordered="false"
      class="rounded-2xl ring-1 ring-slate-200 overflow-hidden"
    />

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-slate-600">تعداد کل: {{ total }}</div>
      <div class="flex items-center gap-2">
        <n-button size="small" :disabled="offset === 0" @click="prev">قبلی</n-button>
        <n-button size="small" :disabled="offset + limit >= total" @click="next">بعدی</n-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { NButton, NCard, NDataTable, NInput, useMessage } from 'naive-ui'
import { apiDelete, apiGet } from '@/utils/api'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permissions'],
  permissions: ['brand.read'],
})

const msg = useMessage()
const { hasPerm } = useAccess()

const q = ref('')
const limit = ref(10)
const offset = ref(0)
const items = ref<any[]>([])
const total = ref(0)
const pending = ref(false)

async function fetchList() {
  pending.value = true
  try {
    const data: any = await apiGet('/brands', {
      params: { q: q.value || undefined, limit: limit.value, offset: offset.value },
    })
    items.value = Array.isArray(data?.items) ? data.items : []
    total.value = typeof data?.total === 'number' ? data.total : items.value.length
  } finally {
    pending.value = false
  }
}

function prev() {
  offset.value = Math.max(0, offset.value - limit.value)
}

function next() {
  if (offset.value + limit.value < total.value) {
    offset.value += limit.value
  }
}

watch([q, limit, offset], fetchList, { immediate: true })

function onEdit(row: any) {
  if (!hasPerm('brand.update')) return
  navigateTo(`/admin/brands/${row.id}`)
}

async function onDelete(row: any) {
  if (!hasPerm('brand.delete')) return
  try {
    await apiDelete(`/brands/${row.id}`)
    msg.success('حذف شد')
    fetchList()
  } catch (e: any) {
    msg.error(e?.data?.message || 'حذف انجام نشد')
  }
}

const columns = computed(() => {
  const canEdit = hasPerm('brand.update')
  const canDelete = hasPerm('brand.delete')

  const baseColumns = [
    { title: 'نام', key: 'name' },
    { title: 'نامک', key: 'slug' },
    {
      title: 'تصویر',
      key: 'image',
      render(row: any) {
        if (!row.image) return h('span', { class: 'text-slate-400' }, '-')
        const base = (useRuntimeConfig().public as any)?.apiBase || '/api/v1'
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const apiUrl = new URL(base as string, origin)
        const src = new URL(`/uploads/${String(row.image).replace(/^\/+/, '')}`, apiUrl).toString()
        return h('img', { src, class: 'h-10 w-10 object-cover rounded-lg ring-1 ring-slate-200' })
      },
    },
    { title: 'وضعیت', key: 'isActive', render: (row: any) => (row.isActive ? 'فعال' : 'غیرفعال') },
  ]

  if (canEdit || canDelete) {
    baseColumns.push({
      title: 'اقدامات',
      key: 'actions',
      render(row: any) {
        const buttons = []
        if (canEdit) {
          buttons.push(
            h(
              NButton,
              { size: 'small', onClick: () => onEdit(row) },
              { default: () => 'ویرایش' }
            )
          )
        }
        if (canDelete) {
          buttons.push(
            h(
              NButton,
              { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) },
              { default: () => 'حذف' }
            )
          )
        }
        return buttons.length
          ? h('div', { class: 'flex items-center gap-2' }, buttons)
          : null
      },
    })
  }

  return baseColumns
})
</script>
