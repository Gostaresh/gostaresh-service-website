import { computed } from 'vue'
import { defineStore } from 'pinia'

type LoginPayload = { userName: string; password: string }
type LoginResponse = { token?: string }

export const useAuthStore = defineStore('auth', () => {
  // Single source of truth for token
  const token = useCookie<string | null>('auth_token', { sameSite: 'lax' })

  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(payload: LoginPayload): Promise<void> {
    const { public: pub } = useRuntimeConfig()
    const apiBase: string = (pub as any)?.apiBase || '/api/v1'
    const loginUrl = `${String(apiBase).replace(/\/$/, '')}/auth/login`

    const res = await $fetch<LoginResponse>(loginUrl, {
      method: 'POST',
      body: { userName: payload.userName, password: payload.password },
    })

    if (!res?.token) throw new Error('ورود ناموفق بود')

    // Store bare token; plugin will add `Bearer` prefix
    token.value = String(res.token).replace(/^Bearer\s+/i, '').trim()
  }

  async function logout(): Promise<void> {
    const { public: pub } = useRuntimeConfig()
    const apiBase: string = (pub as any)?.apiBase || '/api/v1'
    const url = `${String(apiBase).replace(/\/$/, '')}/auth/logout`
    if (token.value) {
      try {
        await $fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token.value}` } })
      } catch {}
    }
    token.value = null
  }

  return { token, isLoggedIn, login, logout }
})

