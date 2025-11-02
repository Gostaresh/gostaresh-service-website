<template>
  <ClientOnly>
    <section class="min-h-[70dvh] flex items-center justify-center px-4" dir="rtl">
      <n-card class="w-full max-w-md rounded-2xl ring-1 ring-slate-200/80 shadow-sm">
        <template #header>
          <div class="text-center w-full space-y-1">
            <h1 class="text-lg font-bold">ورود به حساب کاربری</h1>
            <p class="text-slate-500 text-xs mt-1">
              لطفاً نام کاربری و رمز عبور خود را وارد کنید تا به پنل مدیریت دسترسی پیدا کنید.
            </p>
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="onSubmit" @keydown.enter.prevent="onSubmit">
          <n-form :model="form" :rules="rules" :disabled="loading" ref="formRef">
            <n-form-item path="userName" label="نام کاربری">
              <n-input v-model:value="form.userName" placeholder="admin" size="large" />
            </n-form-item>
            <n-form-item path="password" label="رمز عبور">
              <n-input
                v-model:value="form.password"
                type="password"
                show-password-on="mousedown"
                placeholder="********"
                size="large"
              />
            </n-form-item>
          </n-form>

          <n-alert v-if="error" type="error" class="text-right">{{ error }}</n-alert>

          <n-button type="primary" size="large" class="w-full" :loading="loading" attr-type="submit">
            ورود
          </n-button>
        </form>

        <template #footer>
          <div class="text-center text-xs text-slate-500">
            بازگشت به
            <NuxtLink to="/" class="text-sky-600 hover:underline">صفحه اصلی</NuxtLink>
          </div>
        </template>
      </n-card>
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, nextTick } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NAlert } from 'naive-ui'
import { useAuth } from '@/composables/useAuth'

definePageMeta({ layout: 'default' })

const router = useRouter()
const route = useRoute()
const redirectTo = ref<string>(typeof route.query.redirect === 'string' ? route.query.redirect : '/admin')

const { token, isLoggedIn, user, login, fetchMe } = useAuth()

const formRef = ref<FormInst | null>(null)
const form = reactive({ userName: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

const rules: FormRules = {
  userName: [{ required: true, message: 'نام کاربری الزامی است', trigger: ['blur', 'input'] }],
  password: [{ required: true, message: 'رمز عبور الزامی است', trigger: ['blur', 'input'] }],
}

onMounted(async () => {
  if (isLoggedIn.value && user.value) {
    router.replace(redirectTo.value || '/admin')
    return
  }

  if (!token.value) return

  loading.value = true
  try {
    await fetchMe(token.value)
    if (isLoggedIn.value && (user.value || token.value)) {
      router.replace(redirectTo.value || '/admin')
    }
  } catch (error) {
    if (process.dev) {
      console.warn('[login] token validation failed', error)
    }
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  if (loading.value) return
  error.value = null
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    await login({ userName: form.userName, password: form.password })
    await nextTick()
    router.replace(redirectTo.value || '/admin')
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'ورود ناموفق بود'
  } finally {
    loading.value = false
  }
}
</script>
