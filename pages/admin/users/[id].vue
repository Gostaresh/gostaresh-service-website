<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش کاربر</h1>
      <NuxtLink to="/admin/users" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-6" :bordered="false">
      <n-form :model="form" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="firstName"><n-input v-model:value="form.firstName" /></n-form-item>
        <n-form-item label="نام خانوادگی" path="lastName"><n-input v-model:value="form.lastName" /></n-form-item>
        <n-form-item label="نام کاربری" path="userName"><n-input v-model:value="form.userName" /></n-form-item>
        <n-form-item label="ایمیل" path="email"><n-input v-model:value="form.email" /></n-form-item>
        <div class="pt-2 flex items-center gap-2">
          <n-button type="primary" :loading="saving" @click="onSubmit">ذخیره</n-button>
          <n-button type="error" secondary :loading="deleting" @click="onDelete">حذف</n-button>
        </div>
      </n-form>
    </n-card>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <template #header>نقش‌های کاربر</template>
      <div class="space-y-3">
        <n-select v-model:value="selectedRoleIds" :options="roleOptions" multiple filterable placeholder="نقش‌ها" />
        <div>
          <n-button type="primary" :loading="savingRoles" @click="saveRoles">ذخیره نقش‌ها</n-button>
        </div>
      </div>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NCard, NForm, NFormItem, NInput, NSelect, useMessage } from 'naive-ui'
import { apiDelete, apiGet, apiPut } from '@/utils/api'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const route = useRoute()
const id = String(route.params.id)
const msg = useMessage()
const formRef = ref<InstanceType<typeof NForm> | null>(null)
const form = ref<any>({ firstName: '', lastName: '', userName: '', email: '', isActive: true })
const saving = ref(false)
const deleting = ref(false)

const roles = ref<any[]>([])
const selectedRoleIds = ref<string[]>([])
const savingRoles = ref(false)

onMounted(async () => { await Promise.all([load(), fetchRoles(), loadUserRoles()]) })

async function load() { try { Object.assign(form.value, await apiGet(`/users/${id}`) || {}) } catch { msg.error('خواندن کاربر ناموفق بود') } }
async function onSubmit() { saving.value = true; try { await apiPut(`/users/${id}`, { firstName: form.value.firstName || undefined, lastName: form.value.lastName || undefined, userName: form.value.userName || undefined, email: form.value.email || undefined }); msg.success('ذخیره شد') } catch (e: any) { msg.error(e?.data?.message || 'خطا در ذخیره') } finally { saving.value = false } }
async function onDelete() { if (!confirm('حذف کاربر؟')) return; deleting.value = true; try { await apiDelete(`/users/${id}`); msg.success('حذف شد'); navigateTo('/admin/users') } catch (e: any) { msg.error(e?.data?.message || 'خطا در حذف') } finally { deleting.value = false } }

async function fetchRoles() { try { roles.value = await apiGet('/roles') as any[] } catch { roles.value = [] } }
const roleOptions = computed(() => roles.value.map((r: any) => ({ label: r.name || r.id, value: String(r.id) })))

async function loadUserRoles() {
  try {
    const data = (await apiGet(`/users/${id}/roles`)) as any
    const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
    selectedRoleIds.value = arr.map((x: any) => String(x?.id ?? x))
  } catch { selectedRoleIds.value = [] }
}

async function saveRoles() {
  savingRoles.value = true
  try {
    await apiPut(`/users/${id}/roles`, selectedRoleIds.value)
    msg.success('نقش‌ها ذخیره شد')
  } catch (e: any) { msg.error(e?.data?.message || 'خطا در ذخیره نقش‌ها') } finally { savingRoles.value = false }
}
</script>

