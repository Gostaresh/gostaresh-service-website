import { useState } from "#app";
import type { NuxtApp } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const loading = useState("page-loading", () => false);
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const show = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    loading.value = true;
  };

  const hide = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    hideTimer = setTimeout(() => {
      loading.value = false;
      hideTimer = null;
    }, 150);
  };

  nuxtApp.hook("page:start", show);
  nuxtApp.hook("page:finish", hide);
  nuxtApp.hook("page:error", hide);
});

