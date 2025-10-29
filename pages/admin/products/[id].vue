<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش محصول</h1>
      <NuxtLink to="/admin/products" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-6" :bordered="false">
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
          <n-input v-model:value="priceInput" />
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
        <div class="pt-2 flex items-center gap-2">
          <n-button type="primary" :loading="saving" @click="onSubmit">ذخیره</n-button>
          <n-button type="error" secondary :loading="deleting" @click="onDelete">حذف</n-button>
        </div>
      </n-form>
    </n-card>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <template #header>گالری تصاویر</template>
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <input ref="fileInput" type="file" multiple accept="image/*" />
          <n-button :loading="uploading" size="small" @click="uploadSelected">آپلود تصاویر</n-button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div v-for="g in galleries" :key="g.id" class="rounded-xl border border-slate-200 p-2">
            <img :src="fullUrl(g.path)" class="h-28 w-full object-cover rounded-lg" />
            <div class="flex items-center justify-between mt-2">
              <n-button size="tiny" :type="g.isMain ? 'primary' : 'default'" @click="setMain(g)">اصلی</n-button>
              <n-switch size="small" v-model:value="g.isActive" @update:value="(v)=>toggleActive(g,v)" />
              <n-button size="tiny" type="error" secondary @click="removeGallery(g)">حذف</n-button>
            </div>
          </div>
        </div>
      </div>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NCard, NForm, NFormItem, NInput, NSelect, NSwitch, useMessage } from 'naive-ui'
import { apiDelete, apiGet, apiPatch, apiPut } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = String(route.params.id)
const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ name: '', slug: '', shortDescription: '', longDescription: '', price: 0, brandID: '', categoryID: '', statusID: '', isActive: true })
const saving = ref(false)
const deleting = ref(false)

const brands = ref<any[]>([])
const categories = ref<any[]>([])
const statuses = ref<any[]>([])

const galleries = ref<any[]>([])
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  await Promise.all([load(), fetchFilters(), fetchGalleries()])
})

async function load() {
  try { Object.assign(form.value, await apiGet(`/products/${id}`) || {}) } catch (e) { msg.error('خواندن محصول ناموفق بود') }
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

async function fetchGalleries() {
  try { galleries.value = await apiGet(`/products/${id}/galleries`) as any[] } catch { galleries.value = [] }
}

const brandOptions = computed(() => brands.value.map((x: any) => ({ label: x.name || x.slug || x.id, value: x.id })))
const categoryOptions = computed(() => categories.value.map((x: any) => ({ label: x.name || x.slug || x.id, value: x.id })))
const statusOptions = computed(() => statuses.value.map((x: any) => ({ label: x.name || x.title || x.id || String(x), value: x.id || x.value || String(x) })))

const priceInput = computed({ get: () => (form.value.price ? String(form.value.price) : ''), set: (v: string) => (form.value.price = Number(v.replace(/[^\d]/g, '')) || 0) })

const rules = { name: { required: true, message: 'نام الزامی است', trigger: 'blur' }, price: { required: true, message: 'قیمت الزامی است', trigger: 'blur' } }

async function ensureSlug() {
  if (!form.value.name || form.value.slug) return
  try {
    const { slug } = await useApiFetch()<{ slug: string }>('utils/slug/preview', { method: 'POST', body: { model: 'product', source: form.value.name, excludeId: id } })
    if (slug) form.value.slug = slug
  } catch {}
}

async function onSubmit() {
  try { await formRef.value?.validate() } catch { return }
  saving.value = true
  try {
    await apiPut(`/products/${id}`, {
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
    msg.success('ذخیره شد')
  } catch (e: any) { msg.error(e?.data?.message || 'خطا در ذخیره') } finally { saving.value = false }
}

async function onDelete() { if (!confirm('حذف محصول؟')) return; deleting.value = true; try { await apiDelete(`/products/${id}`); navigateTo('/admin/products') } catch (e: any) { msg.error(e?.data?.message || 'خطا در حذف') } finally { deleting.value = false } }

function fullUrl(path: string) {
  if (!path) return ''
  const cfg = useRuntimeConfig().public as any
  const origin = cfg.apiOrigin || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${String(origin).replace(/\/$/, '')}/uploads/${path.replace(/^\/+/, '')}`
}

async function uploadSelected() {
  const files = Array.from(fileInput.value?.files || [])
  if (!files.length) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('scope', `products/${id}`)
    for (const f of files) fd.append('files', f)
    const { $apiFetch } = useNuxtApp()
    const res = await $apiFetch<{ files: Array<{ path: string; fileName: string }> }>('files/upload/multi', { method: 'POST', body: fd })
    const arr = Array.isArray(res?.files) ? res.files : []
    // create gallery records
    for (const f of arr) {
      await $apiFetch(`products/${id}/galleries`, { method: 'POST', body: { path: f.path, fileName: f.fileName } })
    }
    fileInput.value && (fileInput.value.value = '')
    await fetchGalleries()
    msg.success('تصاویر افزوده شد')
  } catch (e: any) {
    msg.error(e?.data?.message || 'خطا در آپلود')
  } finally { uploading.value = false }
}

async function setMain(g: any) { try { await apiPatch(`/galleries/${g.id}/main`) ; await fetchGalleries() } catch {} }
async function toggleActive(g: any, v: boolean) { try { await apiPatch(`/galleries/${g.id}`, { isActive: v }) } catch {} }
async function removeGallery(g: any) { if (!confirm('حذف تصویر؟')) return; try { await apiDelete(`/galleries/${g.id}`); await fetchGalleries() } catch {} }
</script>

