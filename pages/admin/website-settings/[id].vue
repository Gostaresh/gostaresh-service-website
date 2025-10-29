<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش تنظیم سایت</h1>
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
import AdminImageUploader from '@/components/AdminImageUploader.vue'
import { apiDelete, apiGet, apiPut } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = String(route.params.id)
const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ name: '', title: '', description: '', image: '', attribute: '', href: '', kindID: '', isActive: true })
const saving = ref(false)
const deleting = ref(false)
const kinds = ref<any[]>([])

onMounted(async () => { await Promise.all([load(), fetchKinds()]) })
async function load() { try { Object.assign(form.value, await apiGet(`/website-settings/${id}`) || {}) } catch { msg.error('خواندن ناموفق بود') } }
async function fetchKinds() { try { kinds.value = await apiGet('/website-setting-kinds') as any[] } catch {} }
const kindOptions = computed(() => kinds.value.map((k: any) => ({ label: k.name || k.id, value: k.id })))

const rules = { name: { required: true, message: 'نام الزامی است', trigger: 'blur' }, kindID: { required: true, message: 'نوع الزامی است', trigger: 'blur' } }

async function onSubmit() { try { await formRef.value?.validate() } catch { return } ; saving.value = true; try { await apiPut(`/website-settings/${id}`, { name: form.value.name, title: form.value.title || undefined, description: form.value.description || undefined, image: form.value.image || undefined, attribute: form.value.attribute || undefined, href: form.value.href || undefined, kindID: form.value.kindID, isActive: form.value.isActive }); msg.success('ذخیره شد') } catch (e: any) { msg.error(e?.data?.message || 'خطا در ذخیره') } finally { saving.value = false } }
async function onDelete() { if (!confirm('حذف تنظیم؟')) return; deleting.value = true; try { await apiDelete(`/website-settings/${id}`); msg.success('حذف شد'); navigateTo('/admin/website-settings') } catch (e: any) { msg.error(e?.data?.message || 'خطا در حذف') } finally { deleting.value = false } }
</script>

