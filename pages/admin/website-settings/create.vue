<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">افزودن تنظیم سایت</h1>
      <NuxtLink to="/admin/website-settings" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="name"><n-input v-model:value="form.name" /></n-form-item>
        <n-form-item label="عنوان" path="title"><n-input v-model:value="form.title" /></n-form-item>
        <n-form-item label="توضیحات" path="description"><n-input v-model:value="form.description" type="textarea" /></n-form-item>
        <n-form-item label="تصویر" path="image"><AdminImageUploader v-model="form.image" scope="website-settings" /></n-form-item>
        <n-form-item label="attribute" path="attribute"><n-input v-model:value="form.attribute" /></n-form-item>
        <n-form-item label="لینک" path="href"><n-input v-model:value="form.href" /></n-form-item>
        <n-form-item label="نوع" path="kindID"><n-select v-model:value="form.kindID" :options="kindOptions" filterable /></n-form-item>
        <n-form-item label="فعال"><n-switch v-model:value="form.isActive" /></n-form-item>
        <div class="pt-2"><n-button type="primary" :loading="submitting" @click="onSubmit">ثبت</n-button></div>
      </n-form>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NButton, NCard, NForm, NFormItem, NInput, NSelect, NSwitch, useMessage } from 'naive-ui'
import AdminImageUploader from '@/components/AdminImageUploader.vue'
import { apiGet, apiPost } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ name: '', title: '', description: '', image: '', attribute: '', href: '', kindID: '', isActive: true })
const submitting = ref(false)
const kinds = ref<any[]>([])

onMounted(async () => { try { kinds.value = await apiGet('/website-setting-kinds') as any[] } catch {} })
const kindOptions = computed(() => kinds.value.map((k: any) => ({ label: k.name || k.id, value: k.id })))

const rules = { name: { required: true, message: 'نام الزامی است', trigger: 'blur' }, kindID: { required: true, message: 'نوع الزامی است', trigger: 'blur' } }

async function onSubmit() {
  try { await formRef.value?.validate() } catch { return }
  submitting.value = true
  try {
    await apiPost('/website-settings', {
      name: form.value.name,
      title: form.value.title || undefined,
      description: form.value.description || undefined,
      image: form.value.image || undefined,
      attribute: form.value.attribute || undefined,
      href: form.value.href || undefined,
      kindID: form.value.kindID,
      isActive: form.value.isActive,
    })
    msg.success('ثبت شد')
    navigateTo('/admin/website-settings')
  } catch (e: any) { msg.error(e?.data?.message || 'خطا در ثبت') } finally { submitting.value = false }
}
</script>

