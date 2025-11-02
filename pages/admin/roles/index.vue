<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">نقش‌ها</h1>
      <NuxtLink
        v-if="canCreate"
        to="/admin/roles/create"
        class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm"
      >
        <Icon name="ph:plus" /> افزودن نقش
      </NuxtLink>
    </div>

    <n-data-table :columns="columns" :data="items" :loading="pending" :bordered="false" class="rounded-2xl ring-1 ring-slate-200 overflow-hidden" />
  </section>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { NButton, NDataTable, useMessage } from 'naive-ui'
import { apiDelete, apiGet } from '@/utils/api'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permissions'],
  permissions: ['role.read'],
})

const { hasPerm } = useAccess()
const msg = useMessage()
const items = ref<any[]>([])
const pending = ref(false)

const canCreate = computed(() => hasPerm('role.create'))
const canEdit = computed(() => hasPerm('role.update'))
const canDelete = computed(() => hasPerm('role.delete'))

async function fetchList() {
  pending.value = true
  try {
    items.value = (await apiGet('/roles')) as any[]
  } finally {
    pending.value = false
  }
}
onMounted(fetchList)

function onEdit(row: any) {
  if (!canEdit.value) return
  navigateTo(`/admin/roles/${row.id}`)
}

async function onDelete(row: any) {
  if (!canDelete.value) return
  if (!confirm('حذف نقش؟')) return
  try {
    await apiDelete(`/roles/${row.id}`)
    msg.success('حذف شد')
    fetchList()
  } catch (e: any) {
    msg.error(e?.data?.message || 'حذف انجام نشد')
  }
}

const columns = computed(() => {
  const baseColumns = [
    { title: 'نام', key: 'name' },
    { title: 'شناسه', key: 'id' },
  ]

  if (canEdit.value || canDelete.value) {
    baseColumns.push({
      title: 'اقدامات',
      key: 'actions',
      render(row: any) {
        const buttons = []
        if (canEdit.value) {
          buttons.push(
            h(
              NButton,
              { size: 'small', onClick: () => onEdit(row) },
              { default: () => 'ویرایش' }
            )
          )
        }
        if (canDelete.value) {
          buttons.push(
            h(
              NButton,
              { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) },
              { default: () => 'حذف' }
            )
          )
        }
        return buttons.length ? h('div', { class: 'flex items-center gap-2' }, buttons) : null
      },
    })
  }

  return baseColumns
})
</script>
