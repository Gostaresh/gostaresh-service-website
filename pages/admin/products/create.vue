<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">افزودن محصول</h1>
      <NuxtLink to="/admin/products" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="name">
          <n-input v-model:value="form.name" @blur="ensureSlug" />
        </n-form-item>
        <n-form-item label="اسلاگ" path="slug">
          <n-input v-model:value="form.slug" />
        </n-form-item>
        <n-form-item label="خلاصه" path="shortDescription">
          <n-input v-model:value="form.shortDescription" type="textarea" />
        </n-form-item>
        <n-form-item label="توضیح کامل" path="longDescription">
          <n-input v-model:value="form.longDescription" type="textarea" />
        </n-form-item>
        <n-form-item label="قیمت (تومان)" path="price">
          <n-input v-model:value="priceInput" placeholder="مثلاً 1200000" />
        </n-form-item>
        <n-form-item label="برند" path="brandID">
          <n-select v-model:value="form.brandID" :options="brandOptions" filterable clearable />
        </n-form-item>
        <n-form-item label="دسته‌بندی" path="categoryID">
          <n-select v-model:value="form.categoryID" :options="categoryOptions" filterable clearable />
        </n-form-item>
        <n-form-item label="وضعیت" path="statusID">
          <n-select v-model:value="form.statusID" :options="statusOptions" filterable clearable />
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
const form = ref<any>({ name: '', slug: '', shortDescription: '', longDescription: '', price: 0, brandID: '', categoryID: '', statusID: '', isActive: true })
const submitting = ref(false)

const brands = ref<any[]>([])
const categories = ref<any[]>([])
const statuses = ref<any[]>([])

onMounted(async () => {
  try {
    const [b, c, s] = await Promise.all([
      apiGet('brands', { params: { limit: 100, offset: 0 } }),
      apiGet('categories', { params: { limit: 100, offset: 0 } }),
      apiGet('product-statuses'),
    ])
    brands.value = Array.isArray(b?.items) ? b.items : []
    categories.value = Array.isArray(c?.items) ? c.items : []
    statuses.value = Array.isArray(s) ? s : Array.isArray(s?.items) ? s.items : []
  } catch {}
})

const brandOptions = computed(() => brands.value.map((x: any) => ({ label: x.name || x.slug || x.id, value: x.id })))
const categoryOptions = computed(() => categories.value.map((x: any) => ({ label: x.name || x.slug || x.id, value: x.id })))
const statusOptions = computed(() => statuses.value.map((x: any) => ({ label: x.name || x.title || x.id || String(x), value: x.id || x.value || String(x) })))

const priceInput = computed({
  get: () => (form.value.price ? String(form.value.price) : ''),
  set: (v: string) => (form.value.price = Number(v.replace(/[^\d]/g, '')) || 0),
})

const rules = {
  name: { required: true, message: 'نام الزامی است', trigger: 'blur' },
  price: { required: true, message: 'قیمت الزامی است', trigger: 'blur' },
}

async function ensureSlug() {
  if (!form.value.name || form.value.slug) return
  try {
    const { slug } = await $apiFetch<{ slug: string }>(`/utils/slug/preview`, {
      method: 'POST',
      body: { model: 'product', source: form.value.name },
    })
    if (slug) form.value.slug = slug
  } catch {}
}

async function onSubmit() {
  try { await formRef.value?.validate() } catch { return }
  submitting.value = true
  try {
    await apiPost('products', {
      name: form.value.name,
      shortDescription: form.value.shortDescription || undefined,
      longDescription: form.value.longDescription || undefined,
      price: form.value.price,
      statusID: form.value.statusID || undefined,
      brandID: form.value.brandID || undefined,
      categoryID: form.value.categoryID || undefined,
      slug: form.value.slug || undefined,
      isActive: form.value.isActive,
    })
    msg.success('محصول افزوده شد')
    navigateTo('/admin/products')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در ثبت')
  } finally { submitting.value = false }
}
</script>


