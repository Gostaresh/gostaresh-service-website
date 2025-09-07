<template>
  <!-- موبایل: پایین صفحه -->
  <div v-if="ready" class="fixed bottom-3 inset-x-3 z-40 md:hidden" dir="rtl">
    <div
      class="rounded-2xl bg-white/95 backdrop-blur ring-1 ring-slate-200 shadow-lg p-2 flex items-center justify-around"
    >
      <a class="quick-btn" :href="`tel:${data.phone}`" aria-label="تماس">
        <Icon name="ph:phone-duotone" size="18" /><span>تماس</span>
      </a>
      <a
        class="quick-btn"
        :href="`https://wa.me/${data.whatsapp}`"
        target="_blank"
        rel="noopener"
        aria-label="واتساپ"
      >
        <Icon name="ph:whatsapp-logo-duotone" size="18" /><span>واتساپ</span>
      </a>
      <a class="quick-btn" :href="`mailto:${data.email}`" aria-label="ایمیل">
        <Icon name="ph:envelope-duotone" size="18" /><span>ایمیل</span>
      </a>
      <NuxtLink class="quick-btn" :to="data.ticket" aria-label="تیکت">
        <Icon name="ph:chat-teardrop-text-duotone" size="18" /><span>تیکت</span>
      </NuxtLink>
    </div>
  </div>

  <!-- دسکتاپ: ستون کنار -->
  <div
    v-if="ready"
    class="hidden md:flex fixed z-40 right-6 top-1/2 -translate-y-1/2 flex-col gap-2"
    dir="rtl"
  >
    <a class="side-btn" :href="`tel:${data.phone}`" aria-label="تماس"
      ><Icon name="ph:phone-duotone"
    /></a>
    <a
      class="side-btn"
      :href="`https://wa.me/${data.whatsapp}`"
      target="_blank"
      rel="noopener"
      aria-label="واتساپ"
      ><Icon name="ph:whatsapp-logo-duotone"
    /></a>
    <a class="side-btn" :href="`mailto:${data.email}`" aria-label="ایمیل"
      ><Icon name="ph:envelope-duotone"
    /></a>
    <NuxtLink class="side-btn" :to="data.ticket" aria-label="تیکت"
      ><Icon name="ph:chat-teardrop-text-duotone"
    /></NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

type QC = { phone: string; whatsapp: string; email: string; ticket: string };
const data = ref<QC | null>(null);
const ready = ref(false);

onMounted(async () => {
  data.value = (await import("@/public/data/quick-contacts.json"))
    .default as QC[];
  ready.value = !!data.value;
});
</script>

<style scoped>
.quick-btn {
  @apply inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition;
}
.side-btn {
  @apply grid place-items-center size-10 rounded-xl bg-white/95 ring-1 ring-slate-200 text-slate-700 hover:bg-slate-100 transition;
}
</style>
