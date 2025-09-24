<template>
  <div class="min-h-screen bg-slate-950 text-white" dir="rtl">
    <div
      class="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16"
    >
      <div class="text-center">
        <p
          v-if="error?.statusCode"
          class="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400"
        >
          {{ error.statusCode }}
        </p>
        <h1 class="mt-4 text-3xl font-bold md:text-4xl">
          صفحه‌ای که دنبالش بودید پیدا نشد
        </h1>
        <p class="mt-3 text-sm text-slate-300 md:text-base">
          {{ description }}
        </p>
      </div>

      <ClientOnly>
        <div class="mt-10 w-full max-w-2xl">
          <lottie-player
            :src="lottieSrc"
            background="transparent"
            speed="1"
            autoplay
            loop
            class="mx-auto aspect-[4/3] w-full max-w-md"
          ></lottie-player>
        </div>
        <template #fallback>
          <div
            class="mt-10 h-64 w-full max-w-md rounded-3xl bg-slate-900/60"
          ></div>
        </template>
      </ClientOnly>

      <div class="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
          @click="handleRecover"
        >
          بازگشت به صفحه اصلی
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          @click="reloadPage"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type NuxtError = {
  statusCode?: number;
  message?: string;
};

const props = defineProps<{ error: NuxtError }>();

const lottieSrc = "/lottie/errors/404.json";

const description = computed(
  () =>
    props.error?.message ||
    "ممکن است نشانی صفحه تغییر کرده باشد یا صفحه حذف شده باشد. می‌توانید به صفحهٔ اصلی برگردید یا دوباره تلاش کنید."
);

const pageTitle = computed(() =>
  props.error?.statusCode === 404 ? "صفحه یافت نشد" : "خطا"
);

useHead({
  title: pageTitle.value,
  script: [
    {
      src: "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
      defer: true,
    },
  ],
});

const handleRecover = () => {
  clearError({ redirect: "/" });
};

const reloadPage = () => {
  if (process.client) {
    window.location.reload();
  }
};
</script>
