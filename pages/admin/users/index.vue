<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">کاربران</h1>
      <NuxtLink
        v-if="canCreate"
        to="/admin/users/create"
        class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm"
      >
        <Icon name="ph:plus" /> افزودن کاربر
      </NuxtLink>
    </div>

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
import { NButton, NDataTable, useMessage } from 'naive-ui'
import { apiDelete, apiGet } from '@/utils/api'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permissions'],
  permissions: ['user.read'],
})

const { hasPerm } = useAccess()
const msg = useMessage()

const limit = ref(10)
const offset = ref(0)
const items = ref<any[]>([])
const total = ref(0)
const pending = ref(false)

const canCreate = computed(() => hasPerm('user.create'))
const canEdit = computed(() => hasPerm('user.update'))
const canDelete = computed(() => hasPerm('user.delete'))

async function fetchList() {
  pending.value = true
  try {
    const data: any = await apiGet('/users', { params: { limit: limit.value, offset: offset.value } })
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

watch([limit, offset], fetchList, { immediate: true })

function onEdit(row: any) {
  if (!canEdit.value) return
  navigateTo(`/admin/users/${row.id}`)
}

async function onDelete(row: any) {
  if (!canDelete.value) return
  if (!confirm('حذف کاربر؟')) return
  try {
    await apiDelete(`/users/${row.id}`)
    msg.success('حذف شد')
    fetchList()
  } catch (e: any) {
    msg.error(e?.data?.message || 'حذف انجام نشد')
  }
}

const columns = computed(() => {
  const baseColumns = [
    { title: 'نام', key: 'firstName' },
    { title: 'نام خانوادگی', key: 'lastName' },
    { title: 'نام کاربری', key: 'userName' },
    { title: 'ایمیل', key: 'email' },
    { title: 'وضعیت', key: 'isActive', render: (row: any) => (row.isActive ? 'فعال' : 'غیرفعال') },
  ]

  if (canEdit.value || canDelete.value) {
    baseColumns.push({
      title: 'اقدامات',
      key: 'actions',
      render(row: any) {
        const actions = []
        if (canEdit.value) {
          actions.push(
            h(
              NButton,
              { size: 'small', onClick: () => onEdit(row) },
              { default: () => 'ویرایش' }
            )
          )
        }
        if (canDelete.value) {
          actions.push(
            h(
              NButton,
              { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) },
              { default: () => 'حذف' }
            )
          )
        }
        return actions.length ? h('div', { class: 'flex items-center gap-2' }, actions) : null
      },
    })
  }

  return baseColumns
})
</script>
