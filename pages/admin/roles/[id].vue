<template>
  <section class="container mx-auto px-4 py-8" dir="rtl">
    <div class="mb-5 flex items-center justify-between gap-3">
      <h1 class="text-xl font-bold">ویرایش نقش</h1>
      <NuxtLink to="/admin/roles" class="text-sky-600 hover:underline text-sm">بازگشت</NuxtLink>
    </div>

    <n-card class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm mb-6" :bordered="false">
      <n-form :model="form" :rules="rules" ref="formRef" label-placement="left" label-width="140">
        <n-form-item label="نام" path="name"><n-input v-model:value="form.name" :disabled="!canUpdate" /></n-form-item>
        <div class="pt-2 flex items-center gap-2">
          <n-button v-if="canUpdate" type="primary" :loading="saving" @click="onSubmit">ذخیره</n-button>
          <n-button v-if="canDelete" type="error" secondary :loading="deleting" @click="onDelete">حذف</n-button>
        </div>
      </n-form>
    </n-card>

    <n-card
      v-if="canManagePermissions"
      class="rounded-2xl ring-1 ring-slate-200/80 shadow-sm"
      :bordered="false"
    >
      <template #header>مجوزهای نقش</template>
      <div class="space-y-3">
        <n-select
          v-model:value="selectedPermissionIds"
          :options="permissionOptions"
          :disabled="!canEditPermissions"
          multiple
          filterable
          placeholder="انتخاب مجوز"
        />
        <div>
          <n-button type="primary" :loading="savingPerms" :disabled="!canEditPermissions" @click="savePermissions">
            ذخیره مجوزها
          </n-button>
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

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permissions'],
  permissions: ['role.read'],
})

const { hasPerm } = useAccess()

const canUpdate = computed(() => hasPerm('role.update'))
const canDelete = computed(() => hasPerm('role.delete'))
const canEditPermissions = computed(() => hasPerm('role_permission.update'))
const canFetchPermissions = computed(() => hasPerm('permission.read'))
const canManagePermissions = computed(
  () => canEditPermissions.value || canFetchPermissions.value
)

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

onMounted(async () => {
  await load()
  if (canFetchPermissions.value) {
    await fetchPermissions()
  }
  if (canManagePermissions.value) {
    await loadRolePermissions()
  }
})

async function load() {
  try {
    Object.assign(form.value, (await apiGet(`/roles/${id}`)) || {})
  } catch {
    msg.error('خواندن نقش ناموفق بود')
  }
}

async function onSubmit() {
  if (!canUpdate.value) return
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    await apiPut(`/roles/${id}`, { name: form.value.name })
    msg.success('ذخیره شد')
  } catch (e: any) {
    msg.error(e?.data?.message || 'ذخیره انجام نشد')
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  if (!canDelete.value) return
  if (!confirm('حذف نقش؟')) return
  deleting.value = true
  try {
    await apiDelete(`/roles/${id}`)
    msg.success('حذف شد')
    navigateTo('/admin/roles')
  } catch (e: any) {
    msg.error(e?.data?.message || 'حذف انجام نشد')
  } finally {
    deleting.value = false
  }
}

async function fetchPermissions() {
  try {
    permissions.value = (await apiGet('/permissions')) as any[]
  } catch {
    permissions.value = []
  }
}

const permissionOptions = computed(() =>
  permissions.value.map((p: any) => ({ label: p.name || p.id, value: String(p.id) }))
)

async function loadRolePermissions() {
  try {
    const data = (await apiGet(`/roles/${id}`)) as any
    const arr = Array.isArray(data?.permissions) ? data.permissions : []
    selectedPermissionIds.value = arr.map((x: any) => String(x?.id ?? x))
  } catch {
    selectedPermissionIds.value = []
  }
}

async function savePermissions() {
  if (!canEditPermissions.value) return
  savingPerms.value = true
  try {
    await apiPut(`/roles/${id}/permissions`, {
      permissionIDs: selectedPermissionIds.value,
    })
    msg.success('مجوزها ذخیره شد')
  } catch (e: any) {
    msg.error(e?.data?.message || 'ذخیره مجوزها انجام نشد')
  } finally {
    savingPerms.value = false
  }
}
</script>
