<template>
  <div class="space-y-6" dir="rtl">
    <h1 class="text-xl font-bold">استعلام وضعیت گارانتی</h1>

    <!-- فرم -->
    <n-card :bordered="false" class="rounded-2xl ring-1 ring-slate-200/70">
      <n-alert type="info" :show-icon="true" class="mb-4">
        برای نتیجه بهتر، شماره را دقیق و بدون فاصله وارد کنید. نمونه:
        <n-tag
          v-for="s in sampleSerials"
          :key="s"
          size="small"
          round
          type="info"
          :bordered="false"
          class="ltr cursor-pointer mx-1"
          @click="fillSample(s)"
          >{{ s }}</n-tag
        >
      </n-alert>

      <n-form :model="form" :rules="rules" label-placement="top" ref="formRef">
        <!-- موبایل: عمودی | دسکتاپ: در یک ردیف -->
        <div class="flex flex-col md:flex-row md:items-end gap-4">
          <!-- سریال -->
          <div class="w-full md:flex-1 md:min-w-[360px]">
            <n-form-item label="سریال / IMEI" path="serial" class="mb-0">
              <div class="ltr">
                <n-input
                  v-model:value="form.serial"
                  size="large"
                  clearable
                  maxlength="40"
                  placeholder="مثلاً: SN1234567890"
                  @update:value="onSerialInput"
                  @keydown.enter.prevent="submit"
                >
                  <template #prefix>
                    <Icon name="ph:fingerprint-duotone" size="18" />
                  </template>
                </n-input>
              </div>
              <template #feedback>
                <div class="text-xs text-slate-500">
                  حروف انگلیسی و اعداد مجاز است؛ خط تیره مجاز.
                </div>
              </template>
            </n-form-item>
          </div>

          <!-- موبایل -->
          <div class="w-full md:w-[32%]">
            <n-form-item label="موبایل (اختیاری)" path="phone" class="mb-0">
              <div class="ltr">
                <n-input
                  v-model:value="form.phone"
                  size="large"
                  clearable
                  maxlength="11"
                  placeholder="09xxxxxxxxx"
                  @update:value="onPhoneInput"
                  @keydown.enter.prevent="submit"
                >
                  <template #prefix>
                    <Icon name="ph:device-mobile-duotone" size="18" />
                  </template>
                </n-input>
              </div>
              <template #feedback>
                <div class="text-xs text-slate-500">
                  برای اعلان تغییر وضعیت، می‌توانید شماره موبایل را وارد کنید.
                </div>
              </template>
            </n-form-item>
          </div>

          <!-- دکمه‌ها -->
          <div class="w-full md:w-[16%] md:pt-[28px]">
            <div class="flex gap-2 md:justify-end">
              <n-button
                type="primary"
                size="large"
                strong
                round
                class="w-full md:w-auto"
                :loading="loading"
                @click="submit"
              >
                استعلام
              </n-button>
              <n-button
                quaternary
                size="large"
                round
                class="w-full md:w-auto"
                @click="resetForm"
              >
                پاک کردن
              </n-button>
            </div>
          </div>
        </div>
      </n-form>
    </n-card>

    <!-- نتیجه -->
    <n-card
      v-if="result"
      :segmented="{ content: 'soft', footer: 'soft' }"
      class="rounded-2xl"
      :bordered="false"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <span>نتیجه استعلام</span>
          <n-tag :type="result.warrantyActive ? 'success' : 'error'">
            {{ result.warrantyActive ? "گارانتی فعال" : "گارانتی منقضی" }}
          </n-tag>
        </div>
      </template>

      <n-spin :show="loading">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <n-statistic label="برند" :value="result.brand" />
          <n-statistic label="مدل" :value="result.model" />
          <n-statistic label="سریال" :value="result.serial" class="ltr" />
          <n-statistic label="تاریخ خرید" :value="j(result.purchaseDate)" />
          <n-statistic label="پایان گارانتی" :value="j(result.expireDate)" />
          <n-statistic label="روز باقیمانده" :value="toFa(remainDays)" />
        </div>

        <div class="mt-4">
          <div
            class="flex items-center justify-between text-sm text-slate-600 mb-2"
          >
            <span>پیشرفت مصرف گارانتی</span>
            <span>{{ toFa(progressPct) }}%</span>
          </div>
          <n-progress
            type="line"
            :percentage="progressPct"
            :height="10"
            processing
          />
        </div>

        <n-divider>روند رسیدگی</n-divider>
        <WarrantyStatusSteps :status="result.status" />

        <n-divider />
        <n-space size="large" align="center">
          <span class="text-slate-500"
            >مرکز خدمات: {{ result.serviceCenter }}</span
          >
          <span class="text-slate-400 text-xs"
            >به‌روزرسانی: {{ j(result.updatedAt) }}</span
          >
        </n-space>
      </n-spin>

      <template #action>
        <n-space>
          <n-button quaternary @click="printPage">چاپ</n-button>
          <n-button quaternary @click="copyLink">کپی لینک پیگیری</n-button>
          <n-button quaternary :disabled="!form.phone" @click="enableSms"
            >فعالسازی پیامک</n-button
          >
        </n-space>
      </template>
    </n-card>

    <!-- پیدا نشد -->
    <n-result
      v-else-if="hasSearched && !loading"
      status="warning"
      title="موردی یافت نشد"
      :description="`سریال «${form.serial || '—'}» در سامانه پیدا نشد.`"
    >
      <template #footer>
        <div class="space-y-2 text-right">
          <div class="text-slate-600 text-sm">
            لطفاً این موارد را بررسی کنید:
          </div>
          <ul class="list-disc pr-5 text-slate-600 text-sm">
            <li>از اعداد انگلیسی استفاده کنید (۰→0، ۱→1 …)</li>
            <li>فاصله و کاراکترهای غیرضروری را حذف کنید</li>
            <li>حروف را انگلیسی و بزرگ وارد کنید</li>
          </ul>
        </div>
      </template>
      <template #action>
        <n-space justify="center">
          <n-button type="primary" secondary @click="resetForm"
            >استعلام جدید</n-button
          >
          <NuxtLink to="/warranty/policies">
            <n-button quaternary>شرایط گارانتی برندها</n-button>
          </NuxtLink>
        </n-space>
      </template>
    </n-result>

    <!-- حالت اولیه -->
    <n-result
      v-else
      status="info"
      title="هنوز جستجویی انجام نشده"
      description="سریال/IMEI را وارد کنید و دکمه استعلام را بزنید."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import {
  NCard,
  NForm,
  NFormItem,
  NFormItemGi,
  NInput,
  NButton,
  NStatistic,
  NTag,
  NSpace,
  NDivider,
  NResult,
  NAlert,
  NSpin,
  NProgress,
  NGrid,
  NGi,
  NGridItem,
  useMessage,
} from "naive-ui";
import WarrantyStatusSteps from "~/components/WarrantyStatusSteps.vue";
import { useJDate } from "~/composables/useJDate";
import { findWarrantyBySerial } from "~/utils/warrantyClient";

type PageResult = {
  serial: string;
  brand: string;
  model: string;
  purchaseDate: Date;
  expireDate: Date;
  warrantyActive: boolean;
  status: string;
  serviceCenter: string;
  updatedAt: Date;
  note?: string;
};

const { j } = useJDate();
const message = useMessage();

/* اعداد */
const toEn = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

/* نمونه‌ها */
const sampleSerials = ["SN1234567890", "AS-TUF-F15-001", "356789012345678"];
const fillSample = (s: string) => {
  onSerialInput(s);
  setTimeout(
    () => document.querySelector<HTMLInputElement>(".ltr input")?.focus(),
    0
  );
};

/* فرم */
const formRef = ref();
const loading = ref(false);
const hasSearched = ref(false);
const form = reactive({ serial: "", phone: "" });

const normalizeSerial = (v: string, opt: { keepDashes?: boolean } = {}) => {
  const en = toEn(v || "");
  const cleaned = en.replace(
    opt.keepDashes ? /[^A-Za-z0-9-]/g : /[^A-Za-z0-9]/g,
    ""
  );
  return cleaned.toUpperCase().slice(0, 40);
};
const onSerialInput = (val: string) => {
  form.serial = normalizeSerial(val, { keepDashes: true });
};
const onPhoneInput = (val: string) => {
  form.phone = toEn(val).replace(/[^\d]/g, "").slice(0, 11);
};

const rules = {
  serial: [
    {
      required: true,
      validator: (_: any, v: string) => {
        const s = normalizeSerial(v);
        if (!s) return new Error("شماره سریال لازم است");
        if (s.length < 5) return new Error("حداقل ۵ کاراکتر");
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
  phone: [
    {
      validator: (_: any, v: string) => {
        if (!v) return true;
        return /^09\d{9}$/.test(toEn(v)) || new Error("فرمت موبایل معتبر نیست");
      },
      trigger: ["input", "blur"],
    },
  ],
};

/* نتیجه */
const result = ref<PageResult | null>(null);

const submit = async () => {
  // @ts-ignore
  const ok = await formRef.value?.validate?.().catch(() => false);
  if (!ok) return;

  hasSearched.value = true;
  loading.value = true;
  try {
    const rec = await findWarrantyBySerial(form.serial);
    if (!rec) {
      result.value = null;
      message.warning("رکوردی برای این سریال یافت نشد");
      return;
    }
    const last = rec.status.history[rec.status.history.length - 1];
    result.value = {
      serial: rec.serials[0],
      brand: rec.brand,
      model: rec.model,
      purchaseDate: new Date(rec.purchaseDate),
      expireDate: new Date(rec.expireDate),
      warrantyActive: new Date(rec.expireDate).getTime() > Date.now(),
      status: rec.status.current,
      serviceCenter: rec.serviceCenter,
      updatedAt: new Date(last?.at || rec.purchaseDate),
      note: last?.note,
    };
  } catch {
    result.value = null;
    message.error("خطا در استعلام. دوباره تلاش کنید.");
  } finally {
    loading.value = false;
  }
};

/* محاسبات نمایشی */
const remainDays = computed(() => {
  if (!result.value) return 0;
  const ms = new Date(result.value.expireDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
});
const progressPct = computed(() => {
  if (!result.value) return 0;
  const start = new Date(result.value.purchaseDate).getTime();
  const end = new Date(result.value.expireDate).getTime();
  const now = Date.now();
  const pct = ((now - start) / Math.max(1, end - start)) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
});

/* اکشن‌ها */
const printPage = () => window.print();
const copyLink = async () => {
  const url = new URL(location.href);
  url.searchParams.set("track", normalizeSerial(form.serial));
  await navigator.clipboard.writeText(url.toString());
  message.success("لینک پیگیری کپی شد");
};
const enableSms = () => {
  message.success("اعلان پیامکی برای این سریال فعال شد (دمو)");
};
const resetForm = () => {
  form.serial = "";
  form.phone = "";
  result.value = null;
  hasSearched.value = false;
  // @ts-ignore
  formRef.value?.restoreValidation?.();
};

/* Prefill از ?track= */
onMounted(() => {
  const t = new URLSearchParams(location.search).get("track");
  if (t) {
    form.serial = normalizeSerial(t);
    submit();
  }
});

useSeoMeta({ title: "استعلام وضعیت گارانتی" });
</script>

<style scoped>
.ltr {
  direction: ltr;
  unicode-bidi: plaintext;
  text-align: left;
}
</style>
