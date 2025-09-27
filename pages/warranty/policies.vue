<template>
  <div class="space-y-6" dir="rtl">
    <n-card
      :bordered="false"
      class="rounded-3xl border border-slate-200/80 bg-gradient-to-l from-sky-50 via-white to-white shadow-sm"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-3">
          <h1 class="text-xl font-bold">شرایط گارانتی برندها</h1>
          <p class="text-sm text-slate-600">
            قوانین پوشش و مدت گارانتی هر برند را بررسی کنید و با فیلترها، سریع‌تر به نتیجه برسید.
          </p>
        </div>
        <div class="flex flex-wrap gap-2 text-xs text-slate-500 md:justify-end">
          <n-tag type="success" round size="small" class="bg-emerald-500/10 text-emerald-700">
            مجموع برندها: {{ toFa(allBrandsCount) }}
          </n-tag>
          <n-tag type="info" round size="small" class="bg-sky-500/10 text-sky-700">
            تعداد سیاست‌ها: {{ toFa(totalPolicies) }}
          </n-tag>
        </div>
      </div>
    </n-card>

    <n-card :bordered="false" class="rounded-3xl border border-slate-200/80 shadow-sm">
      <div class="space-y-5">
        <div class="grid gap-3 md:grid-cols-3">
          <div class="space-y-2">
            <span class="text-xs text-slate-500">برند</span>
            <n-select
              v-model:value="brand"
              :options="brandOptions"
              placeholder="انتخاب برند"
              clearable
              filterable
              size="large"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-slate-500">دسته محصول</span>
            <n-select
              v-model:value="category"
              :options="categoryOptions"
              placeholder="انتخاب دسته"
              clearable
              filterable
              size="large"
            />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-slate-500">جستجو در شرایط</span>
            <n-input
              v-model:value="q"
              placeholder="جستجو در برند، محصول یا شرط..."
              clearable
              size="large"
              @keydown.enter.prevent
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass-duotone" class="text-base text-slate-400" />
              </template>
            </n-input>
          </div>
        </div>

        <div v-if="quickCategories.length" class="space-y-2">
          <n-divider dashed class="!mt-0 !mb-2">دسته‌های پرجستجو</n-divider>
          <n-space wrap :size="[8, 8]">
            <n-tag
              v-for="item in quickCategories"
              :key="item.value"
              checkable
              :checked="category === item.value"
              :type="category === item.value ? 'primary' : 'default'"
              size="small"
              @update:checked="(checked) => toggleCategory(item.value, checked)"
            >
              {{ item.label }}
              <span class="mr-1 text-[11px] text-slate-400">({{ toFa(item.count) }})</span>
            </n-tag>
          </n-space>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <span v-if="hasFilters" class="text-xs text-slate-500">فیلترهای فعال اعمال شده‌اند.</span>
          <n-button v-if="hasFilters" quaternary size="small" @click="clearFilters">
            <template #icon>
              <Icon name="ph:arrow-counter-clockwise-duotone" />
            </template>
            پاک‌سازی فیلترها
          </n-button>
        </div>
      </div>
    </n-card>

    <n-card :bordered="false" class="rounded-3xl border border-slate-200/80 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="text-sm text-slate-500">
          <template v-if="total">
            نمایش {{ toFa(displayedCount) }} از {{ toFa(total) }} سیاست فعال
          </template>
          <template v-else>موردی با این فیلترها پیدا نشد.</template>
        </div>
        <n-pagination
          v-if="total > pagination.pageSize"
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :show-size-picker="pagination.showSizePicker"
          :item-count="total"
          size="small"
          :page-slot="7"
          class="ltr"
        />
      </div>

      <n-divider class="!my-4" />

      <div v-if="paginatedRows.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <n-card
          v-for="row in paginatedRows"
          :key="row.id"
          :bordered="false"
          class="group rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <Icon name="ph:buildings-duotone" class="text-base text-slate-400" />
                  <span>{{ row.brand }}</span>
                </div>
                <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <Icon name="ph:cards-duotone" class="text-base text-slate-400" />
                  <span>{{ row.category }}</span>
                  <n-tag
                    v-if="row.product"
                    size="small"
                    round
                    type="info"
                    class="bg-sky-500/10 text-sky-700"
                  >
                    {{ row.product }}
                  </n-tag>
                </div>
              </div>
              <n-tag type="success" round size="small" class="bg-emerald-500/10 text-emerald-700">
                مدت پوشش: {{ formatDuration(row.duration) }}
              </n-tag>
            </div>

            <n-divider class="!my-0" />

            <div class="space-y-2">
              <span class="text-xs font-medium text-slate-500">شرایط</span>
              <n-ellipsis :line-clamp="4" expand-trigger="click" :tooltip="false" class="text-sm leading-6 text-slate-600">
                {{ row.conditions || "شرایط خاصی ثبت نشده است." }}
              </n-ellipsis>
            </div>
          </div>
        </n-card>
      </div>

      <n-empty v-else description="هیچ سیاستی با فیلترهای انتخابی پیدا نشد." class="py-12">
        <template #extra>
          <n-button v-if="hasFilters" type="primary" secondary @click="clearFilters">
            بازنشانی فیلترها
          </n-button>
        </template>
      </n-empty>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NCard,
  NSelect,
  NInput,
  NTag,
  NSpace,
  NDivider,
  NButton,
  NEmpty,
  NEllipsis,
  NPagination,
} from "naive-ui";

type Policy = {
  id: string;
  brand: string;
  category: string;
  product?: string;
  duration: { value: number; unit: "month" | "day" };
  conditions?: string;
};

const raw = (await import("@/public/data/policies.json")).default as Policy[];

const normalizeBrand = (b: string) =>
  (({ Kingstone: "Kingston", MIKROTIK: "Mikrotik" } as Record<string, string>)[
    b
  ] || b);

const toFa = (source: number | string) =>
  String(source).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
const toEnDigit = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);

const allBrands = computed(() =>
  Array.from(new Set(raw.map((r) => normalizeBrand(r.brand)))).sort()
);
const allBrandsCount = computed(() => allBrands.value.length);
const totalPolicies = raw.length;

const q = ref("");
const brand = ref<string | null>(null);
const category = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

const norm = (s: string) => toEnDigit(s.toLowerCase());

const brandOptions = computed(() =>
  allBrands.value.map((b) => ({ label: b, value: b }))
);

const allCats = computed(() =>
  Array.from(new Set(raw.map((r) => r.category))).sort()
);
const categoryOptions = computed(() =>
  allCats.value.map((c) => ({ label: c, value: c }))
);

const syncFromRouteQuery = () => {
  const qb = route.query.brand;
  const qc = route.query.category;
  const qq = route.query.q;
  const nextBrand = typeof qb === "string" && qb ? normalizeBrand(qb) : null;
  const nextCategory = typeof qc === "string" && qc ? qc : null;
  const nextSearch = typeof qq === "string" ? qq : "";
  if (brand.value !== nextBrand) brand.value = nextBrand;
  if (category.value !== nextCategory) category.value = nextCategory;
  if (q.value !== nextSearch) q.value = nextSearch;
};

syncFromRouteQuery();

const filteredRows = computed(() => {
  const search = norm(q.value || "");
  return raw
    .map((r) => ({ ...r, brand: normalizeBrand(r.brand) }))
    .filter((r) => {
      const matchesBrand = !brand.value || r.brand === brand.value;
      const matchesCat = !category.value || r.category === category.value;
      const matchesSearch =
        !search ||
        norm(
          `${r.brand} ${r.category} ${r.product ?? ""} ${r.conditions ?? ""}`
        ).includes(search);
      return matchesBrand && matchesCat && matchesSearch;
    });
});

const pagination = reactive({
  page: 1,
  pageSize: 12,
  pageSizes: [12, 24, 36],
  showSizePicker: true,
});

const total = computed(() => filteredRows.value.length);
const paginatedRows = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize;
  return filteredRows.value.slice(start, start + pagination.pageSize);
});
const displayedCount = computed(() => paginatedRows.value.length);

const quickCategories = computed(() => {
  const counts = raw.reduce((acc, item) => {
    const key = item.category;
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 6);
});

const hasFilters = computed(
  () => Boolean(brand.value || category.value || q.value.trim())
);

const formatDuration = (duration: Policy["duration"]) => {
  const unit = duration.unit === "day" ? "روز" : "ماه";
  return `${toFa(duration.value)} ${unit}`;
};

const toggleCategory = (value: string, checked: boolean) => {
  category.value = checked ? value : null;
};

const clearFilters = () => {
  brand.value = null;
  category.value = null;
  q.value = "";
};

const buildQueryFromFilters = () => {
  const query: Record<string, string> = {};
  if (brand.value) query.brand = brand.value;
  if (category.value) query.category = category.value;
  if (q.value.trim()) query.q = q.value.trim();
  return query;
};
const getRouteQueryRecord = () => {
  const query: Record<string, string> = {};
  if (typeof route.query.brand === "string" && route.query.brand)
    query.brand = route.query.brand;
  if (typeof route.query.category === "string" && route.query.category)
    query.category = route.query.category;
  if (typeof route.query.q === "string" && route.query.q)
    query.q = route.query.q;
  return query;
};
const isSameQuery = (a: Record<string, string>, b: Record<string, string>) => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
};

watch([brand, category, q], () => {
  pagination.page = 1;
  if (!import.meta.client) return;
  const next = buildQueryFromFilters();
  const current = getRouteQueryRecord();
  if (!isSameQuery(current, next)) {
    router.replace({ query: next });
  }
});

watch(
  () => [route.query.brand, route.query.category, route.query.q],
  () => {
    syncFromRouteQuery();
  }
);

watch(
  () => pagination.pageSize,
  () => {
    pagination.page = 1;
  }
);

watch(filteredRows, (items) => {
  const maxPage = Math.max(1, Math.ceil(items.length / pagination.pageSize));
  if (pagination.page > maxPage) {
    pagination.page = maxPage;
  }
});

useSeoMeta({ title: "شرایط گارانتی برندها" });
</script>






