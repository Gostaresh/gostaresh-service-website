<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">کاربران</h1>
      <NuxtLink to="/admin/users/create" class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm">
        <Icon name="ph:plus" /> افزودن کاربر
      </NuxtLink>
    </div>

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
import { NButton, NDataTable } from 'naive-ui'
import { apiDelete, apiGet } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const limit = ref(10)
const offset = ref(0)
const items = ref<any[]>([])
const total = ref(0)
const pending = ref(false)

async function fetchList() {
  pending.value = true
  try {
    const data: any = await apiGet('/users', { params: { limit: limit.value, offset: offset.value } })
    items.value = Array.isArray(data?.items) ? data.items : []
    total.value = typeof data?.total === 'number' ? data.total : items.value.length
  } finally { pending.value = false }
}

function prev() { offset.value = Math.max(0, offset.value - limit.value) }
function next() { if (offset.value + limit.value < total.value) offset.value += limit.value }
watch([limit, offset], fetchList, { immediate: true })

function onEdit(row: any) { navigateTo(`/admin/users/${row.id}`) }
async function onDelete(row: any) { if (!confirm('حذف کاربر؟')) return; await apiDelete(`/users/${row.id}`); fetchList() }

const columns = computed(() => [
  { title: 'نام', key: 'firstName' },
  { title: 'نام خانوادگی', key: 'lastName' },
  { title: 'نام کاربری', key: 'userName' },
  { title: 'ایمیل', key: 'email' },
  { title: 'فعال', key: 'isActive', render: (r: any) => (r.isActive ? 'بله' : 'خیر') },
  { title: 'عملیات', key: 'actions', render(row: any) { return h('div', { class: 'flex items-center gap-2' }, [ h(NButton, { size: 'small', onClick: () => onEdit(row) }, { default: () => 'ویرایش' }), h(NButton, { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) }, { default: () => 'حذف' }) ]) } },
])
</script>

