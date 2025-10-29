import type { FetchOptions } from 'ofetch'

function normalize(url: string): string {
  // Keep absolute URLs intact
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url
  return url.replace(/^\/+/, '')
}

export function useApiFetch() {
  const { $apiFetch } = useNuxtApp()
  return $apiFetch
}

export function apiGet<T>(url: string, opts?: FetchOptions<'json'>) {
  return useApiFetch()<T>(normalize(url), { method: 'GET', ...opts })
}

export function apiPost<T>(url: string, body?: any, opts?: FetchOptions<'json'>) {
  return useApiFetch()<T>(normalize(url), { method: 'POST', body, ...opts })
}

export function apiPut<T>(url: string, body?: any, opts?: FetchOptions<'json'>) {
  return useApiFetch()<T>(normalize(url), { method: 'PUT', body, ...opts })
}

export function apiPatch<T>(url: string, body?: any, opts?: FetchOptions<'json'>) {
  return useApiFetch()<T>(normalize(url), { method: 'PATCH', body, ...opts })
}

export function apiDelete<T>(url: string, opts?: FetchOptions<'json'>) {
  return useApiFetch()<T>(normalize(url), { method: 'DELETE', ...opts })
}
