import type { $Fetch } from 'ofetch'
import type { PermissionRequirement } from '~/middleware/admin-permissions'

declare module '#app' {
  interface NuxtApp {
    $apiFetch: $Fetch
  }
  interface PageMeta {
    permissions?: PermissionRequirement
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $apiFetch: $Fetch
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    permissions?: PermissionRequirement
  }
}

export {}
