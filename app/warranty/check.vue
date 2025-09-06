<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold">استعلام وضعیت گارانتی</h1>
    <n-card class="rounded-2xl">
      <n-form :model="form" :rules="rules" label-placement="top" ref="formRef">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-6">
            <n-form-item label="سریال / IMEI" path="serial">
              <n-input
                v-model:value="form.serial"
                placeholder="مثلاً: SN1234567890"
                maxlength="40"
              />
            </n-form-item>
          </div>
          <div class="md:col-span-4">
            <n-form-item label="موبایل (اختیاری)" path="phone">
              <n-input v-model:value="form.phone" placeholder="09xxxxxxxxx" />
            </n-form-item>
          </div>
          <div class="md:col-span-2 flex items-end">
            <n-button type="primary" :loading="loading" @click="submit"
              >استعلام</n-button
            >
          </div>
        </div>
      </n-form>
    </n-card>

    <n-card
      v-if="result"
      :segmented="{ content: 'soft', footer: 'soft' }"
      class="rounded-2xl"
    >
      <template #header>نتیجه استعلام</template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <n-statistic label="برند" :value="result.brand" />
        <n-statistic label="مدل" :value="result.model" />
        <n-statistic label="سریال" :value="result.serial" />
        <n-statistic label="تاریخ خرید" :value="j(result.purchaseDate)" />
        <n-statistic label="پایان گارانتی" :value="j(result.expireDate)" />
        <n-statistic label="روز باقیمانده" :value="remainDays" />
      </div>

      <n-divider>روند رسیدگی</n-divider>
      <WarrantyStatusSteps :status="result.status" />

      <n-divider />
      <n-space>
        <n-tag type="success" v-if="result.warrantyActive">گارانتی فعال</n-tag>
        <n-tag type="error" v-else>گارانتی منقضی</n-tag>
        <span class="text-slate-500"
          >مرکز خدمات: {{ result.serviceCenter }}</span
        >
      </n-space>

      <template #action>
        <n-space>
          <n-button quaternary @click="printPage">چاپ</n-button>
          <n-button quaternary @click="copyLink">کپی لینک پیگیری</n-button>
          <n-button quaternary :disabled="!form.phone">فعالسازی پیامک</n-button>
        </n-space>
      </template>
    </n-card>

    <n-empty v-else description="هنوز جستجویی انجام نشده است" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NStatistic,
  NTag,
  NSpace,
  NDivider,
  NEmpty,
} from "naive-ui";
import WarrantyStatusSteps from "~/components/WarrantyStatusSteps.vue";
import { useJDate } from "~/composables/useJDate";

const { j } = useJDate();
const formRef = ref();
const loading = ref(false);
const form = reactive({ serial: "", phone: "" });
const rules = {
  serial: [
    {
      required: true,
      message: "شماره سریال لازم است",
      trigger: ["input", "blur"],
    },
  ],
  phone: [
    {
      validator: (_: any, v: string) =>
        !v ? true : /^09\d{9}$/.test(v) || "فرمت موبایل معتبر نیست",
      trigger: ["input", "blur"],
    },
  ],
};

const result = ref<any>(null);
const submit = async () => {
  // ولیدیشن
  // @ts-ignore
  const ok = await formRef.value?.validate?.().catch(() => false);
  if (!ok) return;
  loading.value = true;
  try {
    // دمو: پاسخ نمونه
    await new Promise((r) => setTimeout(r, 500));
    result.value = {
      serial: form.serial.trim().toUpperCase(),
      brand: "Lenovo",
      model: "IdeaPad 5 15ALC",
      purchaseDate: new Date(2023, 4, 2),
      expireDate: new Date(2025, 4, 2),
      warrantyActive: true,
      status: "qa",
      serviceCenter: "تهران - مرکز خدمات مثال",
      updatedAt: new Date(),
      note: "کنترل کیفیت نهایی",
    };
  } finally {
    loading.value = false;
  }
};
const remainDays = computed(() => {
  if (!result.value) return "—";
  const ms = new Date(result.value.expireDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
});
const printPage = () => window.print();
const copyLink = async () => {
  const link = `${location.origin}${
    location.pathname
  }?track=${encodeURIComponent(result.value?.serial ?? "")}`;
  await navigator.clipboard.writeText(link);
};
useSeoMeta({ title: "استعلام وضعیت گارانتی" });
</script>
