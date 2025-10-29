<template>
  <section class="min-h-[70dvh] flex items-center justify-center px-4" dir="rtl">
    <n-card class="w-full max-w-md rounded-2xl ring-1 ring-slate-200/80 shadow-sm">
      <template #header>
        <div class="text-center w-full">
          <h1 class="text-lg font-bold">ورود به حساب</h1>
          <p class="text-slate-500 text-xs mt-1">
            برای ورود به پنل مدیریت، اطلاعات خود را وارد کنید.
          </p>
        </div>
      </template>

      <ClientOnly>
        <form class="space-y-3" @submit.prevent="onSubmit">
          <n-form :model="form" :disabled="loading">
            <n-form-item label="نام کاربری">
              <n-input v-model:value="form.userName" placeholder="admin" size="large" />
            </n-form-item>
            <n-form-item label="کلمه عبور">
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
          <n-alert v-if="meInfo" type="success" class="text-right">{{ meInfo }}</n-alert>

          <div class="pt-1 flex gap-2">
            <n-button type="primary" size="large" class="w-full flex-1" :loading="loading" attr-type="submit">
              ورود
            </n-button>
            <n-button
              type="default"
              size="large"
              class="w-full flex-1"
              :loading="checking"
              attr-type="button"
              @click="checkMe"
            >
              بررسی توکن (me)
            </n-button>
          </div>
        </form>
      </ClientOnly>

      <template #footer>
        <div class="text-center text-xs text-slate-500">
          بازگشت به
          <NuxtLink to="/" class="text-sky-600 hover:underline">صفحه اصلی</NuxtLink>
        </div>
      </template>
    </n-card>
  </section>
  </template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NAlert } from 'naive-ui'
import { useAuth } from '@/composables/useAuth'
import { apiGet } from '@/utils/api'

definePageMeta({ layout: 'default' })

const router = useRouter()
const route = useRoute()
const redirectTo = ref<string>(typeof route.query.redirect === 'string' ? route.query.redirect : '/admin')

const { isLoggedIn, login } = useAuth()
const form = reactive({ userName: '', password: '' })
const loading = ref(false)
const checking = ref(false)
const error = ref<string | null>(null)
const meInfo = ref<string | null>(null)

onMounted(() => {
  if (isLoggedIn.value) router.replace(redirectTo.value || '/admin')
})

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    await login({ userName: form.userName, password: form.password })
    router.replace(redirectTo.value || '/admin')
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'ورود ناموفق بود'
  } finally {
    loading.value = false
  }
}

async function checkMe() {
  checking.value = true
  error.value = null
  meInfo.value = null
  try {
    const data = await apiGet<any>('auth/me')
    meInfo.value = JSON.stringify(data)
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'درخواست me ناموفق بود'
  } finally {
    checking.value = false
  }
}
</script>

