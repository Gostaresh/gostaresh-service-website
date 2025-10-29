export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const base = (config.public as any)?.apiBase || "/api/v1";

  const apiFetch = $fetch.create({
    baseURL: String(base).replace(/\/$/, ""),
    onRequest({ options }) {
      let token = useCookie<string | null>("auth_token").value;
      // Fallback to localStorage if cookie not yet hydrated on client
      if (!token && process.client) {
        try { token = localStorage.getItem('auth_token') } catch {}
      }
      options.headers = options.headers || {};
      if (token) {
        (
          options.headers as Record<string, string>
        ).Authorization = `Bearer ${token}`;
        if (process.dev && process.client) {
          // Debug only: verify header presence (do not log full token in prod)
          // eslint-disable-next-line no-console
          console.debug("[apiFetch] Authorization set:", `Bearer ${String(token).slice(0, 12)}...`);
        }
      }
    },
    onResponseError(_ctx) {
      // intentionally no redirect on 401 to avoid ping-pong between admin and login
    },
  });

  nuxtApp.provide("apiFetch", apiFetch);
});
