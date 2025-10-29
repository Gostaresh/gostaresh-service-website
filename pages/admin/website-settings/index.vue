<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">تنظیمات سایت</h1>
      <NuxtLink to="/admin/website-settings/create" class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm">
        <Icon name="ph:plus" /> افزودن تنظیم
      </NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-4" :bordered="false">
      <div class="flex flex-wrap items-center gap-3">
        <n-input v-model:value="q" placeholder="جستجو..." class="w-64" clearable size="large">
          <template #prefix><Icon name="ph:magnifying-glass-duotone" /></template>
        </n-input>
        <n-select v-model:value="kindID" :options="kindOptions" placeholder="نوع" class="w-52" clearable />
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
const kindID = ref<string | null>(null)
const onlyActive = ref(false)
const limit = ref(10)
const offset = ref(0)
const items = ref<any[]>([])
const total = ref(0)
const pending = ref(false)
const kinds = ref<any[]>([])

async function fetchList() {
  pending.value = true
  try {
    const data: any = await apiGet('/website-settings', { params: { q: q.value || undefined, kindID: kindID.value || undefined, isActive: onlyActive.value ? true : undefined, limit: limit.value, offset: offset.value } })
    items.value = Array.isArray(data?.items) ? data.items : []
    total.value = typeof data?.total === 'number' ? data.total : items.value.length
  } finally { pending.value = false }
}

async function fetchKinds() { try { kinds.value = await apiGet('/website-setting-kinds') as any[] } catch { kinds.value = [] } }
const kindOptions = computed(() => kinds.value.map((k: any) => ({ label: k.name || k.id, value: k.id })))

function prev() { offset.value = Math.max(0, offset.value - limit.value) }
function next() { if (offset.value + limit.value < total.value) offset.value += limit.value }

watch([q, kindID, onlyActive, limit, offset], fetchList, { immediate: true })
fetchKinds()

function onEdit(row: any) { navigateTo(`/admin/website-settings/${row.id}`) }
async function onDelete(row: any) { if (!confirm('حذف تنظیم؟')) return; await apiDelete(`/website-settings/${row.id}`); fetchList() }

const columns = computed(() => [
  { title: 'نام', key: 'name' },
  { title: 'عنوان', key: 'title' },
  { title: 'نوع', key: 'kindID' },
  { title: 'لینک', key: 'href' },
  { title: 'فعال', key: 'isActive', render: (r: any) => (r.isActive ? 'بله' : 'خیر') },
  { title: 'عملیات', key: 'actions', render(row: any) { return h('div', { class: 'flex items-center gap-2' }, [ h(NButton, { size: 'small', onClick: () => onEdit(row) }, { default: () => 'ویرایش' }), h(NButton, { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) }, { default: () => 'حذف' }) ]) } },
])
</script>

