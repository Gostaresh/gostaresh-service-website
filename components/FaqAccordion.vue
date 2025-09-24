<template>
  <section class="container mx-auto px-4 py-6" dir="rtl">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold">سؤالات متداول</h2>
      <NInput
        v-model:value="q"
        placeholder="جستجو در سؤال‌ها…"
        class="w-64 hidden md:block"
        clearable
      />
    </div>

    <NCollapse>
      <NCollapseItem v-for="(f, i) in filtered" :key="i" :title="f.q">
        <p class="text-slate-700 leading-7" v-html="f.a"></p>
      </NCollapseItem>
    </NCollapse>

    <template v-if="!faqs.length">
      <NSkeleton text :repeat="6" class="mt-3" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NInput, NCollapse, NCollapseItem, NSkeleton } from "naive-ui";

type QA = { q: string; a: string };

const faqs = ref<QA[]>([]);
const q = ref("");

onMounted(async () => {
  faqs.value = (
    await import("@/public/data/faq.json")
  ).default as QA[];
});

const filtered = computed(() => {
  const s = q.value?.trim();
  if (!s) return faqs.value;
  return faqs.value.filter((x) => (x.q + " " + x.a).includes(s));
});
</script>
