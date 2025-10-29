<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش دسته‌بندی</h1>
      <NuxtLink to="/admin/categories" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="120">
        <n-form-item label="نام" path="name">
          <n-input v-model:value="form.name" @blur="ensureSlug" />
        </n-form-item>
        <n-form-item label="اسلاگ" path="slug">
          <n-input v-model:value="form.slug" />
        </n-form-item>
        <n-form-item label="والد" path="parentID">
          <n-select v-model:value="form.parentID" :options="parentOptions" clearable />
        </n-form-item>
        <n-form-item label="فعال">
          <n-switch v-model:value="form.isActive" />
        </n-form-item>
        <div class="pt-2 flex items-center gap-2">
          <n-button type="primary" :loading="saving" @click="onSubmit">ذخیره</n-button>
          <n-button type="error" secondary :loading="deleting" @click="onDelete">حذف</n-button>
        </div>
      </n-form>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NCard, NForm, NFormItem, NInput, NSelect, NSwitch, useMessage } from 'naive-ui'
import { apiDelete, apiGet, apiPut } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = String(route.params.id)
const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ name: '', slug: '', parentID: null, isActive: true })
const parents = ref<any[]>([])
const saving = ref(false)
const deleting = ref(false)

const rules = {
  name: { required: true, message: 'نام الزامی است', trigger: 'blur' },
}

onMounted(async () => {
  await Promise.all([load(), fetchParents()])
})

async function load() {
  try {
    const data: any = await apiGet(`/categories/${id}`)
    Object.assign(form.value, data || {})
  } catch (e) {
    msg.error('خواندن اطلاعات ناموفق بود')
  }
}

async function fetchParents() {
  try {
    const data: any = await apiGet('categories', { params: { limit: 100, offset: 0 } })
    parents.value = Array.isArray(data?.items) ? data.items : []
  } catch {}
}

const parentOptions = computed(() => parents.value.map((p: any) => ({ label: p.name || p.slug || p.id, value: p.id })))

async function ensureSlug() {
  if (!form.value.name || form.value.slug) return
  try {
    const { slug } = await $apiFetch<{ slug: string }>(`/utils/slug/preview`, {
      method: 'POST',
      body: { model: 'category', source: form.value.name, excludeId: id },
    })
    if (slug) form.value.slug = slug
  } catch {}
}

async function onSubmit() {
  try { await formRef.value?.validate() } catch { return }
  saving.value = true
  try {
    await apiPut(`/categories/${id}`, {
      name: form.value.name,
      parentID: form.value.parentID || undefined,
      slug: form.value.slug || undefined,
      isActive: form.value.isActive,
    })
    msg.success('ذخیره شد')
    navigateTo('/admin/categories')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در ذخیره')
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  if (!confirm('حذف دسته‌بندی؟')) return
  deleting.value = true
  try {
    await apiDelete(`/categories/${id}`)
    msg.success('حذف شد')
    navigateTo('/admin/categories')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در حذف')
  } finally {
    deleting.value = false
  }
}
</script>

