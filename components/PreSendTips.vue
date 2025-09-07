<template>
  <section class="container mx-auto px-4 py-6" dir="rtl">
    <h2 class="text-lg font-bold mb-3">قبل از ارسال کالا</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="(tip, i) in tips"
        :key="i"
        class="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 p-5 shadow-sm flex gap-3"
      >
        <div class="shrink-0 mt-1 rounded-xl bg-emerald-50 p-2">
          <Icon name="ph:check-circle-duotone" size="20" />
        </div>
        <p class="text-slate-700 text-sm leading-7" v-html="tip"></p>
      </article>
      <template v-if="!tips.length">
        <div class="md:col-span-2"><NSkeleton text :repeat="4" /></div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NSkeleton } from "naive-ui";

const tips = ref<string[]>([]);

onMounted(async () => {
  try {
    tips.value = (await import("@/public/data/pre-send-tips.json")) as string[];
  } catch {
    tips.value = [];
  }
});
</script>
