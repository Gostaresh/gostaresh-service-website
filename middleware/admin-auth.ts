export default defineNuxtRouteMiddleware((to) => {
  // allow login page itself
  if (to.path === '/admin/login') return

  // apply only for /admin routes
  if (!to.path.startsWith('/admin')) return

  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})

