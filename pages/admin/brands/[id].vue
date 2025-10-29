<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش برند</h1>
      <NuxtLink to="/admin/brands" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-slate-700">{{ form.name || '—' }}</div>
          <n-button type="error" secondary @click="onDelete" :loading="deleting">حذف</n-button>
        </div>
      </template>
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="120">
        <n-form-item label="نام" path="name">
          <n-input v-model:value="form.name" @blur="ensureSlug" />
        </n-form-item>
        <n-form-item label="اسلاگ" path="slug">
          <n-input v-model:value="form.slug" />
        </n-form-item>
        <n-form-item label="توضیحات" path="description">
          <n-input v-model:value="form.description" type="textarea" />
        </n-form-item>
        <n-form-item label="تصویر" path="image">
          <AdminImageUploader v-model="form.image" scope="brands" />
        </n-form-item>
        <n-form-item label="فعال">
          <n-switch v-model:value="form.isActive" />
        </n-form-item>
        <div class="pt-2">
          <n-button type="primary" :loading="saving" @click="onSubmit">ذخیره</n-button>
        </div>
      </n-form>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NCard, NForm, NFormItem, NInput, NSwitch, useMessage } from 'naive-ui'
import AdminImageUploader from '@/components/AdminImageUploader.vue'
import { apiDelete, apiGet, apiPut } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = String(route.params.id)
const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ name: '', slug: '', description: '', image: '', isActive: true })
const saving = ref(false)
const deleting = ref(false)

const rules = {
  name: { required: true, message: 'نام الزامی است', trigger: 'blur' },
}

onMounted(load)

async function load() {
  try {
    const data: any = await apiGet(`/brands/${id}`)
    Object.assign(form.value, data || {})
  } catch (e) {
    msg.error('خواندن اطلاعات ناموفق بود')
  }
}

async function ensureSlug() {
  if (!form.value.name || form.value.slug) return
  try {
    const { slug } = await useApiFetch()<{ slug: string }>('utils/slug/preview', {
      method: 'POST',
      body: { model: 'brand', source: form.value.name, excludeId: id },
    })
    if (slug) form.value.slug = slug
  } catch {}
}

async function onSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    await apiPut(`/brands/${id}`, {
      name: form.value.name,
      description: form.value.description || undefined,
      image: form.value.image || undefined,
      slug: form.value.slug || undefined,
      isActive: form.value.isActive,
    })
    msg.success('ذخیره شد')
    navigateTo('/admin/brands')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در ذخیره')
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  if (!confirm('حذف برند?')) return
  deleting.value = true
  try {
    await apiDelete(`/brands/${id}`)
    msg.success('حذف شد')
    navigateTo('/admin/brands')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در حذف')
  } finally {
    deleting.value = false
  }
}
</script>
