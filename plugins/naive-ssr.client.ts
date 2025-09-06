import { defineNuxtPlugin } from "#app";
import { setup } from "@css-render/vue3-ssr";
export default defineNuxtPlugin((nuxtApp) => {
  // در کلاینت نیازی به setup نیست، ولی نگه می‌داریم
  const app = nuxtApp.vueApp;
  setup(app);
});
