// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // Solo ejecutar en el cliente para evitar hydration issues
  if (process.server) return
  
  const authStore = useAuthStore()

  // Rutas públicas
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Si no está autenticado y va a ruta privada
  if (!authStore.isAuthenticated && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Si está autenticado y va a login, redirigir a productos
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/products')
  }
})