import { defineNuxtPlugin } from "#app";
import { setup } from "@css-render/vue3-ssr";
export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp;
  const collect = setup(app);
  nuxtApp.ssrContext!.rendered = () => {
    nuxtApp.ssrContext!.head = nuxtApp.ssrContext!.head || {};
    const styleText = collect();
    // درج استایل‌های Naive داخل <head>
    // Nuxt خود head را مدیریت می‌کند؛ این فراخوانی کافی است
    // (در Nuxt 4، head آبجکت است و استایل‌ها تزریق می‌شوند)
    nuxtApp.ssrContext!.head.style = (nuxtApp.ssrContext!.head.style ||
      []) as any;
    (nuxtApp.ssrContext!.head.style as any[]).push({ children: styleText });
  };
});
