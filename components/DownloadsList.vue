<template>
  <section class="container mx-auto px-4 py-6" dir="rtl">
    <h2 class="text-lg font-bold mb-3">دانلود فرم‌ها</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="f in files"
        :key="f.id"
        class="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 p-5 shadow-sm flex items-center justify-between gap-3"
      >
        <div>
          <h3 class="font-semibold">{{ f.title }}</h3>
          <p class="text-xs text-slate-500 mt-1">
            آخرین به‌روزرسانی: {{ f.updated }}
          </p>
        </div>
        <a
          :href="f.file"
          download
          class="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-4 py-2 hover:bg-sky-700 transition"
        >
          <Icon name="ph:download-simple-duotone" /> دانلود
        </a>
      </article>

      <template v-if="!files.length">
        <NSkeleton text :repeat="4" />
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NSkeleton } from "naive-ui";

type DL = { id: string; title: string; file: string; updated?: string };
const files = ref<DL[]>([]);

onMounted(async () => {
  files.value = (await import("@/public/data/downloads.json")) as DL[];
});
</script>
