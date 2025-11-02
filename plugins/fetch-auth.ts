import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const base = (config.public as any)?.apiBase || "/api/v1";

  // Normalize base URL for non-local hosts: if config points to localhost
  // but the app is opened via an IP/host, swap hostname to current host.
  let normalizedBase = String(base);
  try {
    if (process.client) {
      const url = new URL(normalizedBase, window.location.origin);
      const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
      const hereIsLocal = ["localhost", "127.0.0.1", "::1"].includes(
        window.location.hostname
      );
      if (isLocal && !hereIsLocal) {
        url.hostname = window.location.hostname;
      }
      normalizedBase = url.toString().replace(/\/$/, "");
    } else {
      normalizedBase = String(base).replace(/\/$/, "");
    }
  } catch {
    normalizedBase = String(base).replace(/\/$/, "");
  }

  const apiFetch = $fetch.create({
    baseURL: normalizedBase,
    onRequest({ options }) {
      // Prefer store token (kept in sync with cookie via Pinia store)
      const authStore = (() => {
        try {
          return useAuthStore();
        } catch {
          return null;
        }
      })();
      let token = authStore?.token?.value ?? null;
      // Fall back to raw cookie (in case store not yet initialised)
      if (!token) {
        token = useCookie<string | null>("auth_token", {
          sameSite: "lax",
          path: "/",
        }).value;
      }
      // Fallback to localStorage if cookie not yet hydrated on client
      if (!token && process.client) {
        try {
          token = localStorage.getItem("auth_token");
        } catch {}
      }
      // Normalize: remove optional Bearer prefix and stray quotes/spaces
      token = token
        ? String(token)
            .replace(/^Bearer\s+/i, "")
            .replace(/^"|"$/g, "")
            .trim()
        : token;
      options.headers = options.headers || {};
      const hasAuthHeader =
        typeof (options.headers as any).Authorization === "string";
      if (token && !hasAuthHeader) {
        (
          options.headers as Record<string, string>
        ).Authorization = `Bearer ${token}`;
        if (process.dev && process.client) {
          // Debug only: verify header presence (do not log full token in prod)
          // eslint-disable-next-line no-console
          console.debug(
            "[apiFetch] base=",
            normalizedBase,
            "Authorization (auto):",
            String((options.headers as any).Authorization).slice(0, 24) + "..."
          );
        }
      } else if (hasAuthHeader && process.client && process.dev) {
        // eslint-disable-next-line no-console
        console.debug(
          "[apiFetch] base=",
          normalizedBase,
          "Authorization (manual):",
          String((options.headers as any).Authorization).slice(0, 24) + "..."
        );
      } else if (!token && process.dev && process.client) {
        // eslint-disable-next-line no-console
        console.warn("[apiFetch] No token resolved for request", options);
      }
    },
    onResponseError(ctx) {
      const { response } = ctx || ({} as any);
      if (response?.status === 401) {
        // Clear credentials when unauthorized
        const t = useCookie<string | null>("auth_token", {
          sameSite: "lax",
          path: "/",
        });
        t.value = null;
        try {
          const store = useAuthStore();
          if (store?.token) store.token.value = null;
        } catch {}
        if (process.client) {
          try {
            localStorage.removeItem("auth_token");
          } catch {}
          try {
            const router = useRouter();
            const current = router.currentRoute.value;
            const path = current?.fullPath || "/admin";
            if (String(path).startsWith("/admin")) {
              router.replace(
                `/admin/login?redirect=${encodeURIComponent(path)}`
              );
            }
          } catch {}
        }
      }
    },
  });

  nuxtApp.provide("apiFetch", apiFetch);
});
