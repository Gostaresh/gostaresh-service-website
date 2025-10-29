<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">محصولات</h1>
      <NuxtLink to="/admin/products/create" class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm">
        <Icon name="ph:plus" /> افزودن محصول
      </NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-4" :bordered="false">
      <div class="flex flex-wrap items-center gap-3">
        <n-input v-model:value="q" placeholder="جستجو..." class="w-64" clearable size="large">
          <template #prefix><Icon name="ph:magnifying-glass-duotone" /></template>
        </n-input>
        <n-select v-model:value="brandID" :options="brandOptions" placeholder="برند" class="w-52" clearable />
        <n-select v-model:value="categoryID" :options="categoryOptions" placeholder="دسته‌بندی" class="w-52" clearable />
        <n-select v-model:value="statusID" :options="statusOptions" placeholder="وضعیت" class="w-52" clearable />
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
const brandID = ref<string | null>(null)
const categoryID = ref<string | null>(null)
const statusID = ref<string | null>(null)
const onlyActive = ref(false)
const limit = ref(10)
const offset = ref(0)
const items = ref<any[]>([])
const total = ref(0)
const pending = ref(false)

const brands = ref<any[]>([])
const categories = ref<any[]>([])
const statuses = ref<any[]>([])

async function fetchList() {
  pending.value = true
  try {
    const data: any = await apiGet('/products', {
      params: {
        q: q.value || undefined,
        brandID: brandID.value || undefined,
        categoryID: categoryID.value || undefined,
        statusID: statusID.value || undefined,
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

async function fetchFilters() {
  try {
    const [b, c, s] = await Promise.all([
      apiGet('/brands', { params: { limit: 100, offset: 0 } }),
      apiGet('/categories', { params: { limit: 100, offset: 0 } }),
      apiGet('/product-statuses'),
    ])
    brands.value = Array.isArray(b?.items) ? b.items : []
    categories.value = Array.isArray(c?.items) ? c.items : []
    statuses.value = Array.isArray(s) ? s : Array.isArray(s?.items) ? s.items : []
  } catch {}
}

const brandOptions = computed(() => brands.value.map((x: any) => ({ label: x.name || x.slug || x.id, value: x.id })))
const categoryOptions = computed(() => categories.value.map((x: any) => ({ label: x.name || x.slug || x.id, value: x.id })))
const statusOptions = computed(() => statuses.value.map((x: any) => ({ label: x.name || x.title || x.id || String(x), value: x.id || x.value || String(x) })))

function prev() { offset.value = Math.max(0, offset.value - limit.value) }
function next() { if (offset.value + limit.value < total.value) offset.value += limit.value }

watch([q, brandID, categoryID, statusID, onlyActive, limit, offset], fetchList, { immediate: true })
fetchFilters()

function onEdit(row: any) { navigateTo(`/admin/products/${row.id}`) }
async function onDelete(row: any) { if (!confirm('حذف محصول؟')) return; await apiDelete(`/products/${row.id}`); fetchList() }

const columns = computed(() => [
  { title: 'نام', key: 'name' },
  { title: 'اسلاگ', key: 'slug' },
  { title: 'قیمت', key: 'price' },
  { title: 'فعال', key: 'isActive', render: (r: any) => (r.isActive ? 'بله' : 'خیر') },
  {
    title: 'عملیات', key: 'actions', render(row: any) {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(NButton, { size: 'small', onClick: () => onEdit(row) }, { default: () => 'ویرایش' }),
        h(NButton, { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) }, { default: () => 'حذف' }),
      ])
    }
  }
])
</script>

