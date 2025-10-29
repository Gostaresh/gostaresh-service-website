<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش نقش</h1>
      <NuxtLink to="/admin/roles" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-6" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="name"><n-input v-model:value="form.name" /></n-form-item>
        <div class="pt-2 flex items-center gap-2">
          <n-button type="primary" :loading="saving" @click="onSubmit">ذخیره</n-button>
          <n-button type="error" secondary :loading="deleting" @click="onDelete">حذف</n-button>
        </div>
      </n-form>
    </n-card>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm" :bordered="false">
      <template #header>مجوزهای نقش</template>
      <div class="space-y-3">
        <n-select v-model:value="selectedPermissionIds" :options="permissionOptions" multiple filterable placeholder="مجوزها" />
        <div>
          <n-button type="primary" :loading="savingPerms" @click="savePermissions">ذخیره مجوزها</n-button>
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
const form = ref<any>({ name: '' })
const rules = { name: { required: true, message: 'نام الزامی است', trigger: 'blur' } }
const saving = ref(false)
const deleting = ref(false)

const permissions = ref<any[]>([])
const selectedPermissionIds = ref<string[]>([])
const savingPerms = ref(false)

onMounted(async () => { await Promise.all([load(), fetchPermissions(), loadRolePermissions()]) })

async function load() { try { Object.assign(form.value, await apiGet(`/roles/${id}`) || {}) } catch { msg.error('خواندن نقش ناموفق بود') } }
async function onSubmit() { try { await formRef.value?.validate() } catch { return } ; saving.value = true; try { await apiPut(`/roles/${id}`, { name: form.value.name }); msg.success('ذخیره شد') } catch (e: any) { msg.error(e?.data?.message || 'خطا در ذخیره') } finally { saving.value = false } }
async function onDelete() { if (!confirm('حذف نقش؟')) return; deleting.value = true; try { await apiDelete(`/roles/${id}`); msg.success('حذف شد'); navigateTo('/admin/roles') } catch (e: any) { msg.error(e?.data?.message || 'خطا در حذف') } finally { deleting.value = false } }

async function fetchPermissions() { try { permissions.value = await apiGet('/permissions') as any[] } catch { permissions.value = [] } }
const permissionOptions = computed(() => permissions.value.map((p: any) => ({ label: p.name || p.id, value: String(p.id) })))

async function loadRolePermissions() {
  try {
    const data = (await apiGet(`/roles/${id}`)) as any
    const arr = Array.isArray(data?.permissions) ? data.permissions : []
    selectedPermissionIds.value = arr.map((x: any) => String(x?.id ?? x))
  } catch { selectedPermissionIds.value = [] }
}

async function savePermissions() {
  savingPerms.value = true
  try { await apiPut(`/roles/${id}/permissions`, selectedPermissionIds.value); msg.success('مجوزها ذخیره شد') } catch (e: any) { msg.error(e?.data?.message || 'خطا در ذخیره مجوزها') } finally { savingPerms.value = false }
}
</script>

