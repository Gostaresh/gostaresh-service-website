<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">افزودن کاربر</h1>
      <NuxtLink to="/admin/users" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="firstName"><n-input v-model:value="form.firstName" /></n-form-item>
        <n-form-item label="نام خانوادگی" path="lastName"><n-input v-model:value="form.lastName" /></n-form-item>
        <n-form-item label="نام کاربری" path="userName"><n-input v-model:value="form.userName" /></n-form-item>
        <n-form-item label="ایمیل" path="email"><n-input v-model:value="form.email" /></n-form-item>
        <n-form-item label="رمز عبور" path="password"><n-input v-model:value="form.password" type="password" /></n-form-item>
        <div class="pt-2">
          <n-button type="primary" :loading="submitting" @click="onSubmit">ذخیره</n-button>
        </div>
      </n-form>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { apiPost } from '@/utils/api'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permissions'],
  permissions: ['user.create'],
})

const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ firstName: '', lastName: '', userName: '', email: '', password: '' })
const rules = {
  userName: { required: true, message: 'نام کاربری الزامی است', trigger: 'blur' },
  password: { required: true, message: 'رمز عبور الزامی است', trigger: 'blur' },
}
const submitting = ref(false)

async function onSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    await apiPost('/users', form.value)
    msg.success('ذخیره شد')
    navigateTo('/admin/users')
  } catch (e: any) {
    msg.error(e?.data?.message || 'ذخیره انجام نشد')
  } finally {
    submitting.value = false
  }
}
</script>
