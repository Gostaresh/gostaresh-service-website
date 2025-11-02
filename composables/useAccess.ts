import { computed } from 'vue'

export type AccessRole = { id: string; name: string; permissions?: Array<{ id: string; name: string }> }
export type AccessUser = { id: string; roles?: AccessRole[] }

export function useAccess() {
  const { user, permissions } = useAuth()

  const permSet = computed<Set<string>>(() => {
    const names = new Set<string>(Array.isArray(permissions.value) ? permissions.value.map((p) => String(p)) : [])
    const u = (user.value || {}) as AccessUser
    for (const r of u.roles || []) {
      for (const p of r.permissions || []) {
        if (p?.name) names.add(String(p.name))
      }
    }
    return names
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
