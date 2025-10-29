<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">نوع تنظیمات سایت</h1>
      <NuxtLink to="/admin/website-setting-kinds/create" class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-3 py-2 text-sm">
        <Icon name="ph:plus" /> افزودن نوع
      </NuxtLink>
    </div>

    <n-data-table :columns="columns" :data="items" :loading="pending" :bordered="false" class="rounded-2xl ring-1 ring-slate-200 overflow-hidden" />
  </section>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { NButton, NDataTable, useMessage } from 'naive-ui'
import { apiDelete, apiGet } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const msg = useMessage()
const items = ref<any[]>([])
const pending = ref(false)

async function fetchList() { pending.value = true; try { items.value = (await apiGet('/website-setting-kinds')) as any[] } finally { pending.value = false } }
onMounted(fetchList)

function onEdit(row: any) { navigateTo(`/admin/website-setting-kinds/${row.id}`) }
async function onDelete(row: any) { if (!confirm('حذف نوع؟')) return; try { await apiDelete(`/website-setting-kinds/${row.id}`); msg.success('حذف شد'); fetchList() } catch (e: any) { msg.error(e?.data?.message || 'خطا در حذف') } }

const columns = computed(() => [
  { title: 'نام', key: 'name' },
  { title: 'شناسه', key: 'id' },
  { title: 'عملیات', key: 'actions', render(row: any) { return h('div', { class: 'flex items-center gap-2' }, [ h(NButton, { size: 'small', onClick: () => onEdit(row) }, { default: () => 'ویرایش' }), h(NButton, { size: 'small', type: 'error', secondary: true, onClick: () => onDelete(row) }, { default: () => 'حذف' }) ]) } },
])
</script>

