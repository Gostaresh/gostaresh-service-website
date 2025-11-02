import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

export type AuthUser = {
  id: string;
  userName?: string;
  roles?: Array<{
    id: string;
    name: string;
    permissions?: Array<{ id: string; name: string }>;
  }>;
};

type LoginPayload = { userName: string; password: string };
type LoginResponse = {
  token?: string;
  user?: AuthUser;
  perms?: string[];
  auth?: { perms?: string[]; roles?: string[] };
};

type MeResponse = {
  auth?: { roles?: string[]; perms?: string[] };
  user?: AuthUser;
};

export const useAuthStore = defineStore("auth", () => {
  const token = useCookie<string | null>("auth_token", {
    sameSite: "lax",
    path: "/",
  });
  const user = ref<AuthUser | null>(null);
  const permissions = ref<string[]>([]);

  const isLoggedIn = computed(() => Boolean(token.value));

  function sanitize(raw: string | null | undefined): string | null {
    if (!raw) return null;
    const clean = String(raw)
      .replace(/^Bearer\s+/i, "")
      .replace(/^"|"$/g, "")
      .trim();
    return clean || null;
  }

  function persistToken(raw: string | null): void {
    const clean = sanitize(raw);
    token.value = clean;
    if (process.client) {
      try {
        if (clean) localStorage.setItem("auth_token", clean);
        else localStorage.removeItem("auth_token");
      } catch {}
    }
  }

  function collectPermissions(
    sourceUser: AuthUser | null | undefined,
    extraPerms?: string[] | null | undefined
  ): string[] {
    const bucket = new Set<string>();
    if (Array.isArray(extraPerms)) {
      for (const perm of extraPerms) {
        if (perm) bucket.add(String(perm));
      }
    }
    if (sourceUser?.roles) {
      for (const role of sourceUser.roles) {
        for (const perm of role?.permissions || []) {
          if (perm?.name) bucket.add(String(perm.name));
        }
      }
    }
    return Array.from(bucket);
  }

  function syncPermissions(
    sourceUser: AuthUser | null | undefined,
    extraPerms?: string[] | null | undefined
  ): void {
    permissions.value = collectPermissions(sourceUser, extraPerms);
  }

  function clearPermissions(): void {
    permissions.value = [];
  }

  async function fetchMe(rawToken?: string | null): Promise<void> {
    const { $apiFetch } = useNuxtApp();
    const forcedToken = sanitize(rawToken);
    const headers = forcedToken
      ? {
          Authorization: `Bearer ${forcedToken}`,
        }
      : undefined;
    try {
      const res = await $apiFetch<MeResponse>("auth/me", {
        method: "GET",
        headers,
      });
      user.value = (res?.user as AuthUser) || null;
      const authPerms = res?.auth?.perms ?? null;
      syncPermissions(user.value, authPerms);
    } catch (error) {
      user.value = null;
      clearPermissions();
      throw error;
    }
  }

  async function login(payload: LoginPayload): Promise<void> {
    const { $apiFetch } = useNuxtApp();
    const res = await $apiFetch<LoginResponse>("auth/login", {
      method: "POST",
      body: { userName: payload.userName, password: payload.password },
    });
    if (!res?.token) throw new Error("ورود ناموفق بود");
    persistToken(res.token);
    if (res.user) {
      user.value = res.user as AuthUser;
    }
    syncPermissions(user.value, res?.perms ?? res?.auth?.perms);
    try {
      await fetchMe(res.token);
    } catch (error) {
      if (process.dev) {
        console.warn("[auth] fetchMe after login failed", error);
      }
    }
  }

  async function logout(): Promise<void> {
    const { $apiFetch } = useNuxtApp();
    try {
      await $apiFetch("auth/logout", { method: "POST" });
    } catch {
      // ignore backend errors, we'll clear local state regardless
    }
    persistToken(null);
    user.value = null;
    clearPermissions();
  }

  if (token.value) {
    fetchMe(token.value).catch(() => {
      /* ignore initial fetch errors */
    });
  }

  return {
    token,
    user,
    isLoggedIn,
    permissions,
    login,
    logout,
    persistToken,
    sanitize,
    fetchMe,
  };
});
