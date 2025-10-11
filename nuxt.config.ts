import { readFileSync } from "node:fs";

const blogRoutes: string[] = (() => {
  try {
    const raw = readFileSync(new URL("./public/data/blogs.json", import.meta.url), "utf-8");
    const data = JSON.parse(raw) as Array<{ slug?: string }>;
    if (Array.isArray(data)) {
      return data
        .map((item) => (item && item.slug ? `/education/${item.slug}` : null))
        .filter((route): route is string => Boolean(route));
    }
  } catch (error) {
    console.warn("[nuxt.config] Failed to read blog routes for prerender", error);
  }
  return [];
})();

export default defineNuxtConfig({
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
      titleTemplate: (t) =>
        t ? `${t} | ع¯ط³طھط±ط´ ط³ط±ظˆغŒط³` : "ع¯ط³طھط±ط´ ط³ط±ظˆغŒط³ â€” ع¯ط³طھط±ط´ ط³غŒط³طھظ… ط§غŒط±ط§ظ†",
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
});
