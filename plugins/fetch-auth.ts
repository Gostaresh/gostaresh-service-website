export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const base = (config.public as any)?.apiBase || "/api/v1";

  const apiFetch = $fetch.create({
    baseURL: String(base).replace(/\/$/, ""),
    onRequest({ options }) {
      const token = useCookie<string | null>("auth_token").value;
      options.headers = options.headers || {};
      if (token) {
        (
          options.headers as Record<string, string>
        ).Authorization = `Bearer ${token}`;
      }
    },
    onResponseError({ response }) {
      if (process.client && response?.status === 401) {
        try {
          const router = useRouter();
          const current = router.currentRoute.value.fullPath;
          if (!current.startsWith("/admin/login")) {
            router.replace(
              `/admin/login?redirect=${encodeURIComponent(current)}`
            );
          }
        } catch {
          // ignore
        }
      }
    },
  });

  nuxtApp.provide("apiFetch", apiFetch);
});
