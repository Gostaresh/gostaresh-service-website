<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">افزودن نوع مقاله</h1>
      <NuxtLink to="/admin/articles/types" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="name">
          <n-input v-model:value="form.name" />
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
import { NButton, NCard, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { apiPost } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ name: '' })
const submitting = ref(false)
const rules = { name: { required: true, message: 'نام الزامی است', trigger: 'blur' } }

async function onSubmit() { try { await formRef.value?.validate() } catch { return } ; submitting.value = true; try { await apiPost('/articles/types', { name: form.value.name }); msg.success('ثبت شد'); navigateTo('/admin/articles/types') } catch (e: any) { msg.error(e?.data?.message || 'خطا در ثبت') } finally { submitting.value = false } }
</script>

