<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">افزودن برند</h1>
      <NuxtLink to="/admin/brands" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
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
          <n-button type="primary" :loading="submitting" @click="onSubmit">ثبت</n-button>
        </div>
      </n-form>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NForm, NFormItem, NInput, NSwitch, useMessage } from 'naive-ui'
import AdminImageUploader from '@/components/AdminImageUploader.vue'
import { apiPost } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref({ name: '', slug: '', description: '', image: '', isActive: true })
const submitting = ref(false)

const rules = {
  name: { required: true, message: 'نام الزامی است', trigger: 'blur' },
}

async function ensureSlug() {
  if (!form.value.name || form.value.slug) return
  try {
    const { slug } = await useApiFetch()<{ slug: string }>('utils/slug/preview', {
      method: 'POST',
      body: { model: 'brand', source: form.value.name },
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
  submitting.value = true
  try {
    await apiPost('/brands', {
      name: form.value.name,
      description: form.value.description || undefined,
      image: form.value.image || undefined,
      slug: form.value.slug || undefined,
      isActive: form.value.isActive,
    })
    msg.success('برند افزوده شد')
    navigateTo('/admin/brands')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در ثبت')
  } finally {
    submitting.value = false
  }
}
</script>
