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

    <n-data-table :columns="columns" :data="rows" :bordered="false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { NSelect, NInput, NDataTable } from "naive-ui";
import { useJDate } from "~/composables/useJDate";
const { j } = useJDate();

const raw: any[] = await $fetch("/data/policies.json");
const q = ref("");
const brand = ref<string | null>(null);
const category = ref<string | null>(null);

const allBrands = Array.from(new Set(raw.map((r) => r.brand)));
const allCats = Array.from(new Set(raw.map((r) => r.category)));

const brandOptions = allBrands.map((b) => ({ label: b, value: b }));
const categoryOptions = allCats.map((c) => ({ label: c, value: c }));

const rows = computed(() =>
  raw.filter(
    (r) =>
      (!brand.value || r.brand === brand.value) &&
      (!category.value || r.category === category.value) &&
      (!q.value || JSON.stringify(r).includes(q.value))
  )
);

const columns = [
  { title: "برند", key: "brand" },
  { title: "دسته", key: "category" },
  { title: "کالا/سری", key: "product" },
  {
    title: "مدت",
    key: "duration",
    render(row: any) {
      const u = row.duration.unit === "day" ? "روز" : "ماه";
      return `${row.duration.value} ${u}`;
    },
  },
  { title: "شرایط/استثناها", key: "conditions" },
];
useSeoMeta({ title: "شرایط گارانتی برندها" });
</script>
