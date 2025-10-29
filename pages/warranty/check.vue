<template>
  <div class="space-y-6" dir="rtl">
    <h1 class="text-xl font-bold">استعلام وضعیت گارانتی</h1>

    <!-- فرم -->
    <n-card :bordered="false" class="rounded-2xl ring-1 ring-slate-200/70">
      <n-alert type="info" :show-icon="true" class="mb-4">
        شماره را دقیق و بدون فاصله وارد کنید. نمونه:
        <n-tag
          v-for="s in sampleSerials"
          :key="s"
          size="small"
          round
          type="info"
          :bordered="false"
          class="ltr cursor-pointer mx-1"
          @click="fillSample(s)"
        >
          {{ s }}
        </n-tag>
      </n-alert>

      <n-form :model="form" :rules="rules" label-placement="top" ref="formRef">
        <!-- موبایل: عمودی | دسکتاپ: در یک ردیف -->
        <div class="flex flex-col md:flex-row md:items-end gap-4">
          <!-- سریال -->
          <div class="w-full md:flex-1 md:min-w-[360px]">
            <n-form-item
              label="سریال کالا/گارانتی یا شماره رهگیری"
              path="serial"
              class="mb-0"
            >
              <div class="ltr">
                <n-input
                  v-model:value="form.serial"
                  size="large"
                  clearable
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
          <div v-if="false" class="w-full md:w-[32%]">
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
        <div
          class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center gap-3">
            <span class="text-base font-semibold">نتیجه استعلام</span>
            <n-tag :type="result.warrantyActive ? 'success' : 'error'">
              {{ result.warrantyActive ? "گارانتی فعال" : "گارانتی منقضی" }}
            </n-tag>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <Icon name="ph:fingerprint-duotone" class="text-base" />
            <span class="ltr font-mono text-sm text-slate-500">{{
              result.serial
            }}</span>
          </div>
        </div>
      </template>

      <n-spin :show="loading">
        <div class="space-y-6">
          <section
            :class="[
              'rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-colors',
              statusVisual.container,
            ]"
          >
            <div
              class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'grid h-12 w-12 place-items-center rounded-full text-2xl',
                    statusVisual.iconWrapper,
                  ]"
                >
                  <Icon :name="statusVisual.icon" />
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-slate-600/80">وضعیت کنونی</p>
                  <p class="text-xl font-semibold">
                    {{
                      result.warrantyActive ? "گارانتی فعال" : "گارانتی منقضی"
                    }}
                    {{ result.serviceCenter }}
                  </p>
                  <p class="text-xs text-slate-500">
                    آخرین بروزرسانی: {{ j(result.updatedAt) }}
                  </p>
                </div>
              </div>

              <div
                class="flex flex-wrap items-center justify-start gap-6 text-slate-700"
              >
                <div class="min-w-[110px] text-center">
                  <p class="text-xs text-slate-500">روز باقیمانده</p>
                  <p class="text-3xl font-bold" :class="statusVisual.accent">
                    {{ toFa(remainDays) }}
                  </p>
                </div>
                <div class="hidden h-12 w-px bg-white/40 md:block" />
                <div class="min-w-[140px] text-center">
                  <p class="text-xs text-slate-500">پایان گارانتی</p>
                  <p class="text-base font-semibold">
                    {{ j(result.expireDate) }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div class="grid gap-3 md:grid-cols-2">
            <div
              v-for="item in detailCards"
              :key="item.label"
              class="rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <Icon :name="item.icon" class="text-lg text-slate-400" />
                  <span>{{ item.label }}</span>
                </div>
                <div
                  :class="[
                    'text-sm font-semibold text-slate-700',
                    item.tone,
                    item.mono ? 'ltr font-mono text-base' : '',
                  ]"
                >
                  {{ item.value }}
                  <span
                    v-if="item.suffix"
                    class="text-xs font-normal text-slate-500"
                    >{{ item.suffix }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div>
            <div
              class="mb-2 flex items-center justify-between text-sm text-slate-600"
            >
              <span>پیشرفت مصرف گارانتی</span>
              <span class="font-medium">{{ toFa(progressPct) }}%</span>
            </div>
            <n-progress
              type="line"
              :percentage="progressPct"
              :height="10"
              :color="statusVisual.progress"
              :indicator-text-color="statusVisual.progress"
              :rail-color="'rgba(148, 163, 184, 0.25)'"
              :show-indicator="false"
            />
          </div>

          <!-- <div class="space-y-4">
            <n-divider>روند رسیدگی</n-divider>
            <WarrantyStatusSteps :status="result.status" />
          </div> -->

          <!-- <n-alert
            v-if="result.note"
            type="warning"
            :show-icon="true"
            class="rounded-xl border-none !bg-amber-50 text-amber-700"
          >
            {{ result.note }}
          </n-alert> -->

          <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-600"
          >
            <div class="flex items-center gap-2">
              <Icon name="ph:map-pin-duotone" class="text-lg text-slate-400" />
              <span>مرکز خدمات: {{ result.serviceCenter }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <Icon
                name="ph:clock-counter-clockwise-duotone"
                class="text-base"
              />
              <span>آخرین بروزرسانی {{ j(result.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </n-spin>

      <template #action>
        <n-space wrap>
          <n-button quaternary @click="printPage">
            <template #icon>
              <Icon name="ph:printer-duotone" />
            </template>
            چاپ
          </n-button>
          <n-button quaternary @click="copyLink">
            <template #icon>
              <Icon name="ph:link-duotone" />
            </template>
            کپی لینک پیگیری
          </n-button>
          <n-button
            v-if="false"
            quaternary
            :disabled="!form.phone"
            @click="enableSms"
          >
            <template #icon>
              <Icon name="ph:chat-circle-text-duotone" />
            </template>
            فعالسازی پیامک
          </n-button>
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
  NInput,
  NButton,
  NTag,
  NSpace,
  NDivider,
  NResult,
  NAlert,
  NSpin,
  NProgress,
  useMessage,
} from "naive-ui";
import WarrantyStatusSteps from "~/components/WarrantyStatusSteps.vue";
import { useJDate } from "~/composables/useJDate";
import { findWarrantyBySerial } from "~/utils/warrantyClient";

type PageResult = {
  serial: string;
  brand: string;
  model: string;
  warrantySerial?: string;
  trackingSerial?: string;
  durationMonths?: number;
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

const normalizeSerial = (v: string) => {
  const en = toEn(v || "");
  return en.toUpperCase();
};
const onSerialInput = (val: string) => {
  form.serial = normalizeSerial(val);
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

// Enforce Latin-only characters and no min-length
(rules as any).serial[0].validator = (_: any, v: string) => {
  const s = normalizeSerial(v);
  if (!s) return new Error("Serial is required");
  if (!/^[\x00-\x7F]*$/.test(s))
    return new Error("Only Latin characters allowed");
  return true;
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
      serial: rec.serials?.[0] || "",
      brand: rec.brand,
      model: rec.model,
      warrantySerial: rec.serials?.[1] || "",
      trackingSerial: rec.serials?.[2] || "",
      durationMonths:
        rec.warranty?.unit === "month" ? rec.warranty.value : undefined,
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
const statusVisual = computed(() => {
  const active = result.value?.warrantyActive;
  if (active === undefined) {
    return {
      container: "border border-slate-200 bg-slate-50 text-slate-600",
      iconWrapper: "bg-slate-200 text-slate-500",
      icon: "ph:shield-duotone",
      accent: "text-slate-600",
      progress: "#0ea5e9",
    };
  }
  if (active) {
    return {
      container: "border border-emerald-200/80 bg-emerald-50 text-emerald-700",
      iconWrapper: "bg-emerald-500/10 text-emerald-600",
      icon: "ph:shield-check-duotone",
      accent: "text-emerald-600",
      progress: "#10b981",
    };
  }
  return {
    container: "border border-rose-200/80 bg-rose-50 text-rose-700",
    iconWrapper: "bg-rose-500/10 text-rose-600",
    icon: "ph:shield-warning-duotone",
    accent: "text-rose-600",
    progress: "#ef4444",
  };
});
const detailCards = computed(() => {
  const r = result.value;
  if (!r) return [];
  const days = remainDays.value;
  const nearExpiry = days <= 10 && days > 0;
  const expired = !r.warrantyActive || days <= 0;
  const daysTone = expired
    ? "text-rose-600"
    : nearExpiry
    ? "text-amber-600"
    : "text-emerald-600";

  return [
    {
      label: "نام محصول",
      value: r.model || "—",
      icon: "ph:device-mobile-duotone",
    },
    {
      label: "سریال دستگاه",
      value: r.serial || "—",
      icon: "ph:barcode-duotone",
      mono: true,
    },
    {
      label: "سریال گارانتی",
      value: r.warrantySerial || "—",
      icon: "ph:identification-badge-duotone",
      mono: true,
    },
    {
      label: "سریال رهگیری",
      value: r.trackingSerial || "—",
      icon: "ph:qrcode-duotone",
      mono: true,
    },
    {
      label: "تاریخ شروع",
      value: j(r.purchaseDate),
      icon: "ph:calendar-check-duotone",
    },
    {
      label: "پایان گارانتی",
      value: j(r.expireDate),
      icon: "ph:calendar-dots-duotone",
    },
  ];
});

// removed apiCards; using detailCards only

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
