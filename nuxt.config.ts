// nuxt.config.ts
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true, // برای SEO صفحات عمومی
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt", "nuxt-icon"],
  css: ["@/assets/css/main.css"],
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)),
    "~": fileURLToPath(new URL("./", import.meta.url)),
  },
  app: {
    head: {
      htmlAttrs: { lang: "fa", dir: "rtl" },
      titleTemplate: (titleChunk) =>
        titleChunk
          ? `${titleChunk} | گسترش سرویس`
          : "گسترش سرویس — گسترش سیستم ایران",
      link: [{ rel: "icon", href: "/brand/favicon.ico" }],
    },
  },
  tailwindcss: { viewer: false },
});
