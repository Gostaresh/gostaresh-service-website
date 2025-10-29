<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش نوع مقاله</h1>
      <NuxtLink to="/admin/articles/types" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="name">
          <n-input v-model:value="form.name" />
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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NCard, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { apiDelete, apiGet, apiPut } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = String(route.params.id)
const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ name: '' })
const rules = { name: { required: true, message: 'نام الزامی است', trigger: 'blur' } }
const saving = ref(false)
const deleting = ref(false)

onMounted(load)
async function load() {
  try {
    const list = (await apiGet('/articles/types')) as any[]
    const current = (Array.isArray(list) ? list : []).find((x: any) => String(x.id) === String(id))
    if (current) Object.assign(form.value, current)
  } catch {}
}

async function onSubmit() {
  try { await formRef.value?.validate() } catch { return }
  saving.value = true
  try {
    await apiPut(`/articles/types/${id}`, { name: form.value.name })
    msg.success('ذخیره شد')
    navigateTo('/admin/articles/types')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در ذخیره')
  } finally { saving.value = false }
}

async function onDelete() {
  if (!confirm('حذف نوع؟')) return
  deleting.value = true
  try {
    await apiDelete(`/articles/types/${id}`)
    msg.success('حذف شد')
    navigateTo('/admin/articles/types')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در حذف')
  } finally { deleting.value = false }
}
</script>
