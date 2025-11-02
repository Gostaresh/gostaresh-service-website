import { readFileSync } from "node:fs"

const blogRoutes: string[] = (() => {
  try {
    const raw = readFileSync(new URL("./public/data/blogs.json", import.meta.url), "utf-8")
    const data = JSON.parse(raw) as Array<{ slug?: string }>
    if (Array.isArray(data)) {
      return data
        .map((item) => (item && item.slug ? `/education/${item.slug}` : null))
        .filter((route): route is string => Boolean(route))
    }
  } catch (error) {
    console.warn("[nuxt.config] Failed to read blog routes for prerender", error)
  }
  return []
})()

const SITE_NAME = "\u06af\u0633\u062a\u0631\u0634 \u0633\u0631\u0648\u06cc\u0633"
const SITE_TAGLINE = "\u062e\u062f\u0645\u0627\u062a \u0648 \u062a\u0639\u0645\u06cc\u0631\u0627\u062a"

export default defineNuxtConfig({
  runtimeConfig: { public: { apiBase: 'http://localhost:3100/api/v1', apiOrigin: 'http://localhost:3100' } },
  devtools: { enabled: true },
  ssr: true,

  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@pinia/nuxt", "@nuxt/icon"],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["lottie-player", "dotlottie-player"].includes(tag),
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "fa" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width,initial-scale=1" },
      ],
      titleTemplate: (t) => (t ? `${t} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TAGLINE}`),
      link: [{ rel: "icon", href: "/brand/favicon.ico" }],
    },
  },

  routeRules: {
    "/education/**": { prerender: true },
  },

  tailwindcss: { viewer: false },

  build: {
    transpile: ["naive-ui", "vueuc", "vdirs", "vooks"],
  },

  vite: {
    resolve: {
      alias: {
        "dayjs/locale/fa": "dayjs/locale/fa.js",
      },
    },
    ssr: {
      noExternal: ["naive-ui", "vueuc", "vdirs", "vooks", "dayjs", "jalaliday"],
    },
    optimizeDeps: {
      include: ["dayjs/locale/fa.js", "naive-ui", "vueuc", "vdirs", "vooks"],
    },
  },

  nitro: {
    prerender: {
      routes: blogRoutes,
      crawlLinks: true,
    },
  },
})
