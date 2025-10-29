import { computed } from 'vue'

type LoginPayload = { userName: string; password: string }
type LoginResponse = { token?: string; user?: Record<string, unknown> }

export function useAuth() {
  const token = useCookie<string | null>('auth_token', { sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
  const user = useCookie<Record<string, unknown> | null>('auth_user', { sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })

  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(payload: LoginPayload): Promise<void> {
    const { public: pub } = typeof useRuntimeConfig === 'function' ? useRuntimeConfig() : ({ public: {} } as any)
    const apiBase: string = (pub as any)?.apiBase || '/api/v1'
    const override = (pub as any)?.authApiLogin as string | undefined
    const loginUrl = override || `${String(apiBase).replace(/\/$/, '')}/auth/login`

    const res = await $fetch<LoginResponse>(loginUrl, { method: 'POST', body: { userName: payload.userName, password: payload.password } })
    if (!res?.token) throw new Error('ورود ناموفق بود')
    const raw = String(res.token)
    const clean = raw.replace(/^Bearer\s+/i, '').trim()
    token.value = clean
    if (process.client) { try { localStorage.setItem('auth_token', clean) } catch {} }
    user.value = (res.user as any) || null
  }

  async function logout(): Promise<void> {
    try {
      const { public: pub } = typeof useRuntimeConfig === 'function' ? useRuntimeConfig() : ({ public: {} } as any)
      const apiBase: string = (pub as any)?.apiBase || '/api/v1'
      const url = `${String(apiBase).replace(/\/$/, '')}/auth/logout`
      if (token.value) {
        await $fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token.value}` } })
      }
    } catch {
      // ignore
    } finally {
      token.value = null
      if (process.client) { try { localStorage.removeItem('auth_token') } catch {} }
      user.value = null
    }
  }

  return { token, user, isLoggedIn, login, logout }
}

