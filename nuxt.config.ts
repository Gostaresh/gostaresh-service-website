// nuxt.config.ts
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt", "nuxt-icon"],

  // مسیر CSS را ساده کن تا مشکل alias پیش نیاد
  // css: ["~/assets/css/main.css"],

  // (اختیاری) این aliasهای سراسری معمولاً لازم نیست؛ می‌تونی حذف‌شون کنی
  // alias: {
  //   '@': fileURLToPath(new URL('./', import.meta.url)),
  //   '~': fileURLToPath(new URL('./', import.meta.url))
  // },

  app: {
    head: {
      htmlAttrs: { lang: "fa", dir: "rtl" },
      titleTemplate: (t) =>
        t ? `${t} | گسترش سرویس` : "گسترش سرویس — گسترش سیستم ایران",
      link: [{ rel: "icon", href: "/brand/favicon.ico" }],
    },
  },

  tailwindcss: { viewer: false },

  // 🔧 مهم: این بسته‌ها را ترنسپایل کن تا ESM صحیح تولید شود
  build: {
    transpile: ["naive-ui", "vueuc", "vdirs", "vooks"],
  },

  vite: {
    resolve: {
      alias: {
        // فیکس Dayjs locale روی ویندوز/SSR
        "dayjs/locale/fa": "dayjs/locale/fa.js",
        // (در صورت نیاز به بای‌پس نهایی vueuc، این را هم می‌توانی اضافه کنی:)
        // 'vueuc': 'vueuc/es/index.js'
      },
    },
    ssr: {
      // 🔧 مهم: اجبار به باندل این بسته‌ها در SSR
      noExternal: ["naive-ui", "vueuc", "vdirs", "vooks", "dayjs", "jalaliday"],
    },
    // (اختیاری اما مفید برای ویندوز)
    optimizeDeps: {
      include: ["dayjs/locale/fa.js", "naive-ui", "vueuc", "vdirs", "vooks"],
    },
  },
});
