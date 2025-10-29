<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">افزودن مقاله</h1>
      <NuxtLink to="/admin/articles" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="عنوان" path="title">
          <n-input v-model:value="form.title" @blur="ensureSlug" />
        </n-form-item>
        <n-form-item label="اسلاگ" path="slug">
          <n-input v-model:value="form.slug" />
        </n-form-item>
        <n-form-item label="نوع" path="articleTypeID">
          <n-select v-model:value="form.articleTypeID" :options="typeOptions" filterable clearable />
        </n-form-item>
        <n-form-item label="خلاصه" path="shortContent">
          <n-input v-model:value="form.shortContent" type="textarea" />
        </n-form-item>
        <n-form-item label="متن کامل" path="longContent">
          <n-input v-model:value="form.longContent" type="textarea" />
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
import { computed, onMounted, ref } from 'vue'
import { NButton, NCard, NForm, NFormItem, NInput, NSelect, NSwitch, useMessage } from 'naive-ui'
import { apiGet, apiPost } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ title: '', slug: '', articleTypeID: '', shortContent: '', longContent: '', isActive: true })
const submitting = ref(false)
const types = ref<any[]>([])

onMounted(async () => {
  try { types.value = await apiGet('articles/types') as any[] } catch {}
})

const typeOptions = computed(() => types.value.map((t: any) => ({ label: t.name || t.id, value: t.id })))

const rules = { title: { required: true, message: 'عنوان الزامی است', trigger: 'blur' } }

async function ensureSlug() {
  if (!form.value.title || form.value.slug) return
  try {
    const { slug } = await $apiFetch<{ slug: string }>(`/utils/slug/preview`, { method: 'POST', body: { model: 'article', source: form.value.title } })
    if (slug) form.value.slug = slug
  } catch {}
}

async function onSubmit() {
  try { await formRef.value?.validate() } catch { return }
  submitting.value = true
  try {
    await apiPost('articles', {
      title: form.value.title,
      articleTypeID: form.value.articleTypeID || undefined,
      shortContent: form.value.shortContent || undefined,
      longContent: form.value.longContent || undefined,
      slug: form.value.slug || undefined,
      isActive: form.value.isActive,
    })
    msg.success('مقاله افزوده شد')
    navigateTo('/admin/articles')
  } catch (e: any) { msg.error(e?.data?.message || 'خطا در ثبت') } finally { submitting.value = false }
}
</script>


