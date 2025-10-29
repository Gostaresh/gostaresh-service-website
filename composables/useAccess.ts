import { computed } from 'vue'

export type AccessRole = { id: string; name: string; permissions?: Array<{ id: string; name: string }> }
export type AccessUser = { id: string; roles?: AccessRole[] }

export function useAccess() {
  const { user } = useAuth()

  const permSet = computed<Set<string>>(() => {
    const u = (user.value || {}) as AccessUser
    const names: string[] = []
    for (const r of u.roles || []) {
      for (const p of r.permissions || []) {
        if (p?.name) names.push(String(p.name))
      }
    }
    return new Set(names)
  })

  function hasPerm(perm: string): boolean {
    return permSet.value.has(perm)
  }
  function hasAny(perms: string[]): boolean {
    return perms.some((p) => hasPerm(p))
  }
  function hasAll(perms: string[]): boolean {
    return perms.every((p) => hasPerm(p))
  }

  return { hasPerm, hasAny, hasAll, permSet }
}
