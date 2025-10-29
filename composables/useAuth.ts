import { useAuthStore } from '~/stores/auth'

type LoginPayload = { userName: string; password: string }

export function useAuth() {
  const store = useAuthStore()

  async function login(payload: LoginPayload): Promise<void> {
    await store.login(payload)
  }

  async function logout(): Promise<void> {
    await store.logout()
  }

  return {
    token: store.token,
    isLoggedIn: store.isLoggedIn,
    login,
    logout,
  }
}
