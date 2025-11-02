import type { FetchOptions, FetchRequest } from 'ofetch'
import { useAuthStore } from '~/stores/auth'

type AnyFetchOptions = FetchOptions<'json'>

function normalize(url: string): string {
  // Keep absolute URLs intact
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url
  return url.replace(/^\/+/, '')
}

function sanitizeToken(raw: string | null | undefined): string | null {
  if (!raw) return null
  const clean = String(raw)
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '')
    .trim()
  return clean || null
}

function resolveToken(): string | null {
  let token: string | null | undefined
  try {
    const store = useAuthStore()
    token = store?.token?.value ?? null
  } catch {
    token = null
  }
  if (!token) {
    try {
      token = useCookie<string | null>('auth_token', {
        sameSite: 'lax',
        path: '/',
      }).value
    } catch {
      token = null
    }
  }
  if (!token && process.client) {
    try {
      token = localStorage.getItem('auth_token')
    } catch {
      token = null
    }
  }
  return sanitizeToken(token)
}

type HeadersLike = Headers | Array<[string, any]> | Record<string, any>

function normalizeHeaders(init?: HeadersLike): Record<string, string> {
  const headers: Record<string, string> = {}
  if (!init) return headers

  if (Array.isArray(init)) {
    for (const [key, value] of init) {
      if (value !== undefined && value !== null) {
        headers[key] = String(value)
      }
    }
  } else if (typeof Headers !== 'undefined' && init instanceof Headers) {
    init.forEach((value, key) => {
      headers[key] = value
    })
  } else if (typeof init === 'object') {
    for (const [key, value] of Object.entries(init)) {
      if (value !== undefined && value !== null) {
        headers[key] = String(value)
      }
    }
  }

  return headers
}

function withAuth<T extends AnyFetchOptions>(opts?: T): T {
  const token = resolveToken()
  if (!token) return (opts ? { ...opts } : ({} as T))

  const headers = normalizeHeaders(opts?.headers)
  const hasAuthHeader = Object.keys(headers).some((key) => key.toLowerCase() === 'authorization')
  if (!hasAuthHeader) {
    headers.Authorization = `Bearer ${token}`
  }

  return {
    ...(opts ?? {}),
    headers,
  } as T
}

function request<T>(url: FetchRequest, opts?: AnyFetchOptions) {
  const { $apiFetch } = useNuxtApp()
  const target =
    typeof url === 'string' ? normalize(url) : url
  return $apiFetch<T>(target as FetchRequest, withAuth(opts))
}

export function useApiFetch() {
  return <T>(url: FetchRequest, opts?: AnyFetchOptions) => request<T>(url, opts)
}

export function apiGet<T>(url: string, opts?: AnyFetchOptions) {
  return request<T>(url, { ...(opts ?? {}), method: 'GET' })
}

export function apiPost<T>(url: string, body?: any, opts?: AnyFetchOptions) {
  return request<T>(url, { ...(opts ?? {}), method: 'POST', body })
}

export function apiPut<T>(url: string, body?: any, opts?: AnyFetchOptions) {
  return request<T>(url, { ...(opts ?? {}), method: 'PUT', body })
}

export function apiPatch<T>(url: string, body?: any, opts?: AnyFetchOptions) {
  return request<T>(url, { ...(opts ?? {}), method: 'PATCH', body })
}

export function apiDelete<T>(url: string, opts?: AnyFetchOptions) {
  return request<T>(url, { ...(opts ?? {}), method: 'DELETE' })
}
