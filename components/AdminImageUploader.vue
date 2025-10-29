<template>
  <div class="space-y-2">
    <div v-if="modelValue" class="flex items-center gap-3">
      <img :src="fullUrl(modelValue)" alt="" class="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
      <n-button size="small" tertiary type="warning" @click="$emit('update:modelValue', '')">حذف تصویر</n-button>
    </div>
    <div class="flex items-center gap-3">
      <input ref="inp" type="file" accept="image/*" @change="onPick" />
      <n-button :loading="loading" size="small" @click="trigger">انتخاب</n-button>
    </div>
    <div v-if="error" class="text-xs text-rose-600">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue?: string; scope: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const inp = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function trigger() {
  inp.value?.click()
}

function fullUrl(path: string) {
  if (!path) return ''
  const cfg = useRuntimeConfig().public as any
  const origin = cfg.apiOrigin || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${String(origin).replace(/\/$/, '')}/uploads/${path.replace(/^\/+/, '')}`
}

async function onPick(ev: Event) {
  const file = (ev.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  loading.value = true
  error.value = null
  try {
    const fd = new FormData()
    fd.append('scope', props.scope)
    fd.append('file', file)
    const { $apiFetch } = useNuxtApp()
    const res = await $apiFetch<{ path: string; fileName: string }>('files/upload', {
      method: 'POST',
      body: fd,
    })
    if (!res?.path) throw new Error('آپلود ناموفق بود')
    emit('update:modelValue', res.path)
    ;(ev.target as HTMLInputElement).value = ''
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'خطای آپلود'
  } finally {
    loading.value = false
  }
}
</script>
