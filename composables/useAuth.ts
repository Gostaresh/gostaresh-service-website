import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export type { AuthUser } from '~/stores/auth'

type LoginPayload = { userName: string; password: string }

export function useAuth() {
  const store = useAuthStore()
  const { token, isLoggedIn, user, permissions } = storeToRefs(store)

  async function login(payload: LoginPayload): Promise<void> {
    await store.login(payload)
  }

  async function logout(): Promise<void> {
    await store.logout()
  }

  async function fetchMe(rawToken?: string | null): Promise<void> {
    await store.fetchMe(rawToken)
  }

  return {
    token,
    isLoggedIn,
    user,
    permissions,
    login,
    logout,
    fetchMe,
  }
}
