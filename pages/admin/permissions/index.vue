<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">مجوزها</h1>
      <div class="text-slate-500 text-sm">لیست تمام دسترسی‌های سیستم</div>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-data-table
        :columns="columns"
        :data="items"
        :loading="pending"
        :bordered="false"
        class="rounded-2xl ring-1 ring-slate-200 overflow-hidden"
      />
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NCard, NDataTable } from 'naive-ui'
import { apiGet } from '@/utils/api'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permissions'],
  permissions: ['permission.read'],
})

const items = ref<any[]>([])
const pending = ref(false)

onMounted(fetchList)

async function fetchList() {
  pending.value = true
  try {
    const data = await apiGet('/permissions')
    items.value = Array.isArray(data) ? data : Array.isArray((data as any)?.items) ? (data as any).items : []
  } finally {
    pending.value = false
  }
}

const columns = computed(() => [
  { title: 'نام', key: 'name' },
  { title: 'شناسه', key: 'id' },
])
</script>
