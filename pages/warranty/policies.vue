<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold">شرایط گارانتی برندها</h1>

    <div class="flex flex-wrap gap-3">
      <n-select
        v-model:value="brand"
        :options="brandOptions"
        placeholder="برند"
        class="w-52"
        clearable
      />
      <n-select
        v-model:value="category"
        :options="categoryOptions"
        placeholder="دسته"
        class="w-52"
        clearable
      />
      <n-input v-model:value="q" placeholder="جستجو…" class="w-64" clearable />
    </div>

    <n-data-table
      :columns="columns"
      :data="rows"
      :bordered="false"
      :pagination="pagination"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { NSelect, NInput, NDataTable } from "naive-ui";
import type { PaginationProps } from "naive-ui";

type Policy = {
  id: string;
  brand: string;
  category: string;
  product?: string;
  duration: { value: number; unit: "month" | "day" };
  conditions?: string;
};

/* ۱) داده را top-level await کن (فایل باید در public/data/policies.json باشد) */
const raw = (await import("@/public/data/policies.json")).default as Policy[];

/* نرمال‌سازی اختیاری چند برند که دو شکل نوشتار دارند */
const normalizeBrand = (b: string) =>
  (({ Kingstone: "Kingston", MIKROTIK: "Mikrotik" } as Record<string, string>)[
    b
  ] || b);

/* ۲) فیلترها */
const q = ref("");
const brand = ref<string | null>(null);
const category = ref<string | null>(null);

const allBrands = computed(() =>
  Array.from(new Set(raw.map((r) => normalizeBrand(r.brand)))).sort()
);
const allCats = computed(() =>
  Array.from(new Set(raw.map((r) => r.category))).sort()
);

const brandOptions = computed(() =>
  allBrands.value.map((b) => ({ label: b, value: b }))
);
const categoryOptions = computed(() =>
  allCats.value.map((c) => ({ label: c, value: c }))
);

/* ۳) جستجو و فیلتر */
const norm = (s: string) => s.toLowerCase();
const rows = computed(() =>
  raw
    .map((r) => ({ ...r, brand: normalizeBrand(r.brand) }))
    .filter(
      (r) =>
        (!brand.value || r.brand === brand.value) &&
        (!category.value || r.category === category.value) &&
        (!q.value || JSON.stringify(r).toLowerCase().includes(norm(q.value)))
    )
);

/* ۴) ستون‌ها */
const columns = [
  { title: "برند", key: "brand" },
  { title: "دسته", key: "category" },
  { title: "کالا/سری", key: "product" },
  {
    title: "مدت",
    key: "duration",
    render(row: Policy) {
      const u = row.duration.unit === "day" ? "روز" : "ماه";
      return `${row.duration.value} ${u}`;
    },
  },
  {
    title: "شرایط/استثناها",
    key: "conditions",
    render(row: Policy) {
      return row.conditions ?? "—";
    },
  },
];
useSeoMeta({ title: "شرایط گارانتی برندها" });

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 12, // اندازه‌ی پیش‌فرض
  showSizePicker: true, // نمایش انتخاب‌گرِ page size
  pageSizes: [10, 12, 20, 50, 100],
  // رویدادهای کنترل:
  onUpdatePage: (p) => (pagination.page = p),
  onUpdatePageSize: (ps) => {
    pagination.pageSize = ps;
    pagination.page = 1; // بعد از تغییر سایز، برگرد صفحه به ۱
  },
});

/* وقتی فیلترها عوض شدند، برو صفحه‌ی ۱ */
watch([brand, category, q], () => {
  pagination.page = 1;
});
</script>
