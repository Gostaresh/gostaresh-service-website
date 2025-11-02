import { abortNavigation } from '#app'
import { createError } from 'h3'

export type PermissionRequirement =
  | string[]
  | {
      any?: string[]
      all?: string[]
    }

function normalizeRequirement(requirement: PermissionRequirement): {
  any: string[]
  all: string[]
} {
  if (Array.isArray(requirement)) {
    return {
      any: [],
      all: requirement,
    }
  }
  return {
    any: Array.isArray(requirement?.any) ? requirement.any : [],
    all: Array.isArray(requirement?.all) ? requirement.all : [],
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const requirement = to.meta?.permissions as PermissionRequirement | undefined
  if (!requirement || (Array.isArray(requirement) && requirement.length === 0)) {
    return
  }

  const { hasAll, hasAny } = useAccess()
  const { any, all } = normalizeRequirement(requirement)

  let allowed = true
  if (all.length) {
    allowed = hasAll(all)
  }
  if (allowed && any.length) {
    allowed = hasAny(any)
  }

  if (!allowed) {
    return abortNavigation(
      createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        data: {
          reason: 'missing-permission',
          required: requirement,
        },
      })
    )
  }
})
