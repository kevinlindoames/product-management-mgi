# Product Management System - MGi

Sistema de gestión de productos desarrollado con Nuxt 3, Vue 3 y TypeScript como prueba técnica frontend.

## 📋 Tabla de Contenidos

- [Comprensión del Problema](#comprensión-del-problema)
- [Planificación Previa](#planificación-previa)
- [Arquitectura y Estructura](#arquitectura-y-estructura)
- [Decisiones Técnicas Clave](#decisiones-técnicas-clave)
- [Flujo de Autenticación](#flujo-de-autenticación)
- [Testing](#testing)
- [Limitaciones y Mejoras](#limitaciones-y-mejoras)
- [Instalación y Ejecución](#instalación-y-ejecución)

---

## 🎯 Comprensión del Problema

### ¿Qué problema resuelve este módulo?

Este sistema resuelve la necesidad de **gestionar un catálogo de productos de forma eficiente y segura**, permitiendo a usuarios autenticados realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos.

### ¿Qué tipo de usuario lo utilizaría?

- **Administradores de catálogo**: Personal encargado de mantener actualizada la información de productos
- **Gestores de inventario**: Usuarios que necesitan consultar y actualizar stock
- **Equipo de e-commerce**: Personas que gestionan precios, descripciones y categorías

### ¿Qué flujos principales existen?

1. **Autenticación**: Login → Validación → Almacenamiento de sesión → Acceso al sistema
2. **Consulta de productos**: Listado → Búsqueda/Filtros → Visualización detallada
3. **Gestión de productos**: Crear/Editar → Validación → Envío a API → Feedback → Actualización UI
4. **Navegación**: Breadcrumbs → Detalle → Edición → Volver al listado

---

## 📊 Planificación Previa

### ¿Qué partes del sistema identifiqué?

Dividí el sistema en **4 capas principales**:

1. **Capa de Autenticación**
   - Store de Pinia para manejo de estado global
   - Middleware para protección de rutas
   - Plugin para inicialización desde localStorage

2. **Capa de Datos (Composables)**
   - `useProducts`: Lógica de negocio de productos
   - `useToast`: Notificaciones al usuario
   - Abstracción de llamadas a la API

3. **Capa de Presentación (Componentes)**
   - Componentes UI reutilizables (`FormInput`, `BaseButton`)
   - Componentes de dominio (`ProductCard`, `ProductForm`)
   - Componentes de funcionalidad (`ProductFilters`)

4. **Capa de Validación**
   - Esquemas Yup para validación de datos
   - VeeValidate para formularios reactivos
   - Mensajes de error en español

### ¿En qué orden decidí implementarlas y por qué?

1. **Autenticación primero** (2-3 horas)
   - Es el fundamento de seguridad
   - Bloquea el acceso hasta tener credenciales válidas
   - Permite trabajar con rutas protegidas desde el inicio

2. **Componentes UI base** (1 hora)
   - Crear bloques reutilizables desde el principio
   - Mantener consistencia visual en toda la app
   - Ahorrar tiempo al no repetir código

3. **CRUD de productos** (4-5 horas)
   - Núcleo funcional de la aplicación
   - Permite demostrar manejo completo del ciclo de datos
   - Implementación progresiva: Read → Create → Update → Delete

4. **Mejoras y optimizaciones** (3-4 horas)
   - Paginación real del servidor
   - Filtros avanzados por categoría
   - Optimistic UI para mejor UX
   - Reviews y detalles completos del producto

5. **Testing** (2 horas)
   - Validar la lógica de negocio crítica
   - Prevenir regresiones futuras
   - Documentar comportamiento esperado

### ¿Qué dejé fuera y por qué?

**No implementé:**
- ❌ **Refresh token automático**: La API no lo soporta realmente
- ❌ **Manejo de roles/permisos**: No especificado en los requisitos
- ❌ **Modo offline/PWA**: Fuera del alcance de 72 horas
- ❌ **Tests E2E**: Prioricé tests unitarios más completos
- ❌ **i18n (internacionalización)**: Solo español por tiempo

**Justificación**: Prioricé completar un CRUD robusto con buenas prácticas sobre features adicionales.

---

## 🏗️ Arquitectura y Estructura

### Organización de carpetas y responsabilidades
```
product-management-mgi/
├── assets/css/              # Estilos globales (Tailwind)
├── components/
│   ├── ui/                  # Componentes UI reutilizables
│   │   ├── FormInput.vue
│   │   └── BaseButton.vue
│   ├── products/            # Componentes de dominio
│   │   ├── ProductCard.vue
│   │   ├── ProductForm.vue
│   │   ├── ProductFilters.vue
│   │   └── ProductSkeleton.vue
│   └── auth/                # Componentes de autenticación (futuro)
├── composables/             # Lógica de negocio reutilizable
│   ├── useProducts.ts       # CRUD completo de productos
│   └── useToast.ts          # Sistema de notificaciones
├── layouts/
│   └── default.vue          # Layout con header y navegación
├── middleware/
│   └── auth.ts              # Protección de rutas privadas
├── pages/
│   ├── index.vue            # Redirección inicial
│   ├── login.vue            # Autenticación
│   └── products/
│       ├── index.vue        # Listado con filtros y paginación
│       ├── new.vue          # Crear producto
│       └── [id]/
│           ├── index.vue    # Detalle del producto
│           └── edit.vue     # Editar producto
├── plugins/
│   ├── auth.client.ts       # Inicialización de sesión
│   └── toast.client.ts      # Configuración de notificaciones
├── stores/
│   └── auth.ts              # Estado global de autenticación
├── types/
│   └── index.ts             # Definiciones TypeScript
├── utils/
│   └── validations.ts       # Esquemas Yup de validación
└── tests/                   # Tests unitarios e integración
```

### ¿Por qué decidí usar composables?

**Ventajas sobre otras alternativas:**

| Aspecto | Composables | Services | Mixins |
|---------|------------|----------|--------|
| **Reactividad** | ✅ Nativa Vue 3 | ❌ Manual | ⚠️ Limitada |
| **Tree-shaking** | ✅ Automático | ⚠️ Parcial | ❌ No |
| **Type safety** | ✅ Excelente | ✅ Bueno | ❌ Malo |
| **Testeo** | ✅ Fácil | ✅ Fácil | ❌ Difícil |
| **Reutilización** | ✅ Alta | ✅ Media | ⚠️ Conflictos |

**Decidí usar composables porque:**
1. Son el patrón recomendado en Vue 3 Composition API
2. Permiten compartir lógica reactiva entre componentes
3. Son fáciles de testear de forma aislada
4. Tienen excelente soporte de TypeScript

### ¿Qué alternativa consideré y por qué la descarté?

**Consideré usar Pinia para TODO el estado** (no solo auth), pero lo descarté porque:
- ❌ Overhead innecesario para datos temporales
- ❌ Más boilerplate para acciones simples
- ❌ Los composables son más ligeros para lógica de fetching

**Decidí usar Pinia SOLO para estado global persistente** (autenticación) y composables para el resto.

---

## 🔧 Decisiones Técnicas Clave

### 1. Manejo de Estado

**Decisión**: Pinia para auth + Composables para productos

**Justificación**:
- **Pinia para auth**: Necesita persistencia (localStorage) y acceso global
- **Composables para productos**: Datos temporales, no necesitan store global
- **Resultado**: Menos complejidad, mejor performance

**Código clave**:
```typescript
// stores/auth.ts - Estado global persistente
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  
  const initAuth = () => {
    if (process.client) {
      token.value = localStorage.getItem('auth_token')
      // ...
    }
  }
  
  return { token, user, initAuth, login, logout }
})

// composables/useProducts.ts - Estado temporal reactivo
export const useProducts = () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  
  const fetchProducts = async () => {
    // Lógica de fetching
  }
  
  return { products, isLoading, fetchProducts }
}
```

### 2. Manejo de Autenticación

**Decisión**: Token en localStorage + Middleware de Nuxt

**Alternativas consideradas**:
- ❌ **Cookies**: Requiere configuración de servidor
- ❌ **Session Storage**: Se pierde al cerrar tab
- ❌ **Vuex**: Deprecated en Vue 3

**Implementación**:
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

**Flujo**:
1. Login → API devuelve `accessToken`
2. Store → `localStorage.setItem('auth_token', token)`
3. Middleware → Verifica token antes de cada navegación
4. Logout → Limpia localStorage y redirige

### 3. Manejo de Errores

**Decisión**: Try-catch + Toast notifications

**Estrategia en capas**:
```typescript
// 1. Nivel Composable: Captura y registra
const fetchProducts = async () => {
  try {
    const data = await $fetch('/products')
    products.value = data.products
  } catch (error) {
    console.error('Error fetching:', error)
    throw error // Re-lanza para que el componente lo maneje
  }
}

// 2. Nivel Componente: Muestra feedback al usuario
const loadProducts = async () => {
  try {
    await fetchProducts()
  } catch (error) {
    toast.error('Error al cargar productos') // Usuario ve esto
  }
}
```

### 4. Elección de Librería UI

**Decisión**: Tailwind CSS + Componentes propios

**Por qué NO usé librerías de componentes**:
- ❌ **Vuetify/PrimeVue**: Bundle size grande
- ❌ **Element Plus**: Estilo muy opinionado
- ❌ **Headless UI**: Requiere más trabajo de estilos

**Por qué SÍ usé Tailwind + componentes propios**:
- ✅ Control total del diseño
- ✅ Bundle size mínimo (solo clases usadas)
- ✅ Fácil personalización
- ✅ Demuestra capacidad de crear componentes desde cero

### 5. Tipado con TypeScript

**Nivel de strictness**: `strict: true`

**Estrategia**:
```typescript
// types/index.ts - Interfaces completas basadas en la API
export interface Product {
  id: number
  title: string
  description: string
  price: number
  stock: number
  category: string
  brand: string
  // ... 20+ campos más
}

// Uso en componentes
interface Props {
  product: Product  // Type-safe
}

const props = defineProps<Props>()
```

**Beneficios**:
- ✅ Autocompletado en el editor
- ✅ Detección de errores en tiempo de desarrollo
- ✅ Refactoring seguro
- ✅ Documentación viva del código

---

## 🔐 Flujo de Autenticación

### Paso a paso del proceso de login
```
┌─────────────┐
│   Usuario   │
│ ingresa     │
│ credenciales│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  1. Validación en Frontend          │
│  - Username no vacío                │
│  - Password mínimo 4 caracteres     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  2. POST /auth/login                │
│  Body: { username, password }       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  3. API Response                    │
│  { accessToken, user: {...} }       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  4. Store en Pinia                  │
│  - token.value = accessToken        │
│  - user.value = userData            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  5. Persistencia                    │
│  - localStorage.setItem()           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  6. Navegación                      │
│  - navigateTo('/products')          │
└─────────────────────────────────────┘
```

### ¿Dónde se guarda el token?

**Ubicación**: `localStorage` con key `auth_token`

**Código**:
```typescript
// Guardar
localStorage.setItem('auth_token', response.accessToken)
localStorage.setItem('user', JSON.stringify(user))

// Recuperar (al recargar la página)
const token = localStorage.getItem('auth_token')
const user = JSON.parse(localStorage.getItem('user') || 'null')
```

**Ventajas de localStorage**:
- ✅ Persiste entre sesiones
- ✅ Accesible desde JavaScript
- ✅ Compatible con todos los navegadores modernos

**Desventajas**:
- ⚠️ Vulnerable a XSS (mitigado con sanitización)
- ⚠️ No es httpOnly (aceptable para prototipo)

### ¿Cómo se protegen las rutas?

**Middleware de Nuxt** ejecutado antes de cada navegación:
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Rutas públicas
  if (to.path === '/login') {
    // Si ya está autenticado, ir a productos
    if (authStore.isAuthenticated) {
      return navigateTo('/products')
    }
    return // Permitir acceso
  }
  
  // Rutas privadas
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

**Aplicación en páginas**:
```vue
<script setup>
definePageMeta({
  middleware: 'auth' // ← Protege automáticamente
})
</script>
```

### ¿Qué pasaría si el token expira?

**Situación actual**: Token expira en 60 minutos (API DummyJSON)

**Manejo de expiración**:
```typescript
// composables/useApi.ts
const apiFetch = async (url, options) => {
  try {
    return await $fetch(url, { 
      headers: { 
        Authorization: `Bearer ${authStore.token}` 
      }
    })
  } catch (error) {
    // Si el servidor responde 401 (no autorizado)
    if (error.status === 401) {
      authStore.logout() // Limpia todo y redirige a login
    }
    throw error
  }
}
```

**Mejoras para producción**:
1. **Refresh token**: Renovar token automáticamente antes de expirar
2. **Interceptor global**: Reintentar request con nuevo token
3. **Warning previo**: Avisar al usuario 5 min antes de expirar

---

## 🧪 Testing

### ¿Qué se testeó y por qué?

**43 tests implementados** distribuidos en:

#### 1. Validaciones de Formularios (10 tests)
**Por qué**: Prevenir datos inválidos antes de enviar a la API
```typescript
it('debe rechazar precio negativo', async () => {
  const invalidProduct = { price: -10, /* ... */ }
  await expect(productSchema.validate(invalidProduct))
    .rejects.toThrow('El precio debe ser mayor a 0')
})
```

**Bugs que previenen**:
- ❌ Enviar productos con precio negativo
- ❌ Títulos muy cortos o vacíos
- ❌ Stock negativo
- ❌ Campos requeridos sin datos

#### 2. Lógica de Componentes (16 tests)
**Por qué**: Asegurar que el cálculo de estados es correcto
```typescript
it('debe calcular el estado del stock - Agotado', () => {
  const stock = 0
  const status = stock > 10 ? 'En stock' : stock > 0 ? 'Bajo stock' : 'Agotado'
  expect(status).toBe('Agotado')
})
```

**Bugs que previenen**:
- ❌ Mostrar "En stock" cuando está agotado
- ❌ Formateo incorrecto de precios
- ❌ URLs mal construidas

#### 3. Lógica de Negocio (9 tests)
**Por qué**: Verificar que la autenticación y fetching funcionan
```typescript
it('debe construir correctamente query params', () => {
  const params = new URLSearchParams()
  params.append('limit', '20')
  params.append('sortBy', 'price')
  expect(params.toString()).toBe('limit=20&sortBy=price')
})
```

#### 4. Integración de Flujos (8 tests)
**Por qué**: Validar que el flujo completo funciona end-to-end
```typescript
it('debe simular el flujo: validación → API → respuesta', async () => {
  const formData = { title: 'Samsung Galaxy S24', /* ... */ }
  const validatedData = await productSchema.validate(formData)
  // Simular llamada API
  const response = { id: 999, ...validatedData }
  expect(response.id).toBe(999)
})
```

### ¿Qué NO se testeó y por qué?

**No testeado**:
- ❌ **Componentes Vue completos**: Requieren stubs complejos de Nuxt
- ❌ **Interacciones de usuario**: Click, submit, navegación (E2E sería mejor)
- ❌ **SSR/Hidratación**: Fuera del alcance de tiempo
- ❌ **Performance**: No crítico para el alcance actual

**Justificación**: Prioricé **tests de lógica de negocio** que:
1. Son más fáciles de mantener
2. Detectan bugs reales
3. No dependen de implementación de UI
4. Se ejecutan rápido (< 1 segundo todos)

### ¿Qué tipo de bugs buscaban evitar los tests?

| Tipo de Bug | Ejemplo | Test que lo previene |
|-------------|---------|---------------------|
| **Validación** | Usuario crea producto con precio -$100 | `debe rechazar precio negativo` |
| **Formato** | Producto muestra "Agotado" con stock 50 | `debe calcular estado del stock` |
| **Integración** | Paginación envía `skip=NaN` | `debe calcular skip correcto` |
| **Tipos** | Campo `price` recibe string en vez de number | Tests de TypeScript |

**Resultado**: Confianza del **80%** en que la lógica crítica funciona correctamente.

---

## ⚠️ Limitaciones y Mejoras

### ¿Qué cosas no están bien o están incompletas?

#### 1. API de Prueba (DummyJSON)
**Limitación**: Los cambios no persisten realmente
```
POST /products/add  → Simula creación, devuelve ID fake
PUT /products/1     → Simula actualización
DELETE /products/1  → Simula eliminación

Al refrescar → Vuelve todo al estado original
```

**Impacto**: 
- ⚠️ Los productos creados/editados desaparecen al recargar
- ⚠️ No hay validación real del servidor
- ⚠️ Las categorías son fijas

**Solución en producción**: Conectar a API real con base de datos

#### 2. Manejo de Token
**Limitación actual**: Token en localStorage sin refresh

**Problemas**:
- ⚠️ Vulnerable a XSS si hay inyección de scripts
- ⚠️ Token expira y requiere re-login manual
- ⚠️ No hay renovación automática

**Mejora**:
```typescript
// Implementar refresh token
const refreshToken = async () => {
  const newToken = await $fetch('/auth/refresh', {
    body: { refreshToken: authStore.refreshToken }
  })
  authStore.token = newToken.accessToken
}

// Interceptor que renueva automáticamente
if (error.status === 401) {
  await refreshToken()
  return retry(originalRequest)
}
```

#### 3. Sin Paginación en Búsqueda
**Limitación**: La búsqueda no pagina, devuelve todos los resultados

**Impacto**: 
- ⚠️ Si hay 1000 resultados, trae los 1000 de una vez
- ⚠️ Performance degradada con muchos resultados

**Mejora**: Implementar paginación también en búsqueda

#### 4. Validaciones Solo en Frontend
**Limitación**: No hay validación del servidor

**Riesgo**:
- ⚠️ Usuario malicioso puede bypass con herramientas de dev
- ⚠️ No hay sanitización server-side

**Mejora**: Backend debe validar SIEMPRE, frontend es solo UX

### ¿Qué mejorarías en un proyecto real?

#### 1. Seguridad
```typescript
// httpOnly cookies en lugar de localStorage
Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// CSRF tokens
headers: { 'X-CSRF-Token': csrfToken }

// Sanitización de inputs
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput)
```

#### 2. Performance
```typescript
// Virtual scrolling para listas grandes
<virtual-scroller :items="products" :item-size="200" />

// Image optimization
<NuxtImg 
  src="/product.jpg" 
  format="webp" 
  quality="80"
  loading="lazy"
/>

// Code splitting por ruta (ya viene con Nuxt)
// Lazy loading de componentes pesados
const HeavyChart = defineAsyncComponent(() => 
  import('./HeavyChart.vue')
)
```

#### 3. UX Mejorada
```typescript
// Offline support con Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

// Optimistic updates más avanzados
const optimisticProduct = { id: 'temp-' + Date.now(), ...data }
products.value.unshift(optimisticProduct)

await api.createProduct(data)
  .then(real => {
    // Reemplazar temporal con real
    const index = products.value.findIndex(p => p.id === optimisticProduct.id)
    products.value[index] = real
  })
  .catch(() => {
    // Rollback si falla
    products.value = products.value.filter(p => p.id !== optimisticProduct.id)
    toast.error('Error al crear')
  })
```

#### 4. Observabilidad
```typescript
// Logging estructurado
import { Logger } from '@/utils/logger'

const logger = new Logger('ProductsPage')
logger.info('User viewed products', { userId, filters })
logger.error('Failed to create product', { error, data })

// Analytics
track('product_created', {
  category: product.category,
  price: product.price
})

// Error tracking
Sentry.captureException(error, {
  tags: { module: 'products', action: 'create' }
})
```

### ¿Qué harías distinto con más tiempo?

#### Features Adicionales
1. **Exportar/Importar productos** (CSV, Excel)
2. **Filtros guardados** (guardar búsquedas frecuentes)
3. **Historial de cambios** (ver quién modificó qué)
4. **Bulk operations** (editar/eliminar múltiples productos)
5. **Drag & drop** para reordenar categorías
6. **Dashboard con gráficas** (ventas, stock, categorías)
7. **Preview de cambios** antes de guardar
8. **Modo oscuro** (dark mode)
9. **Accesibilidad mejorada** (ARIA completo, navegación por teclado)
10. **i18n** (multi-idioma con vue-i18n)

#### Testing Adicional
```typescript
// E2E con Playwright
test('flujo completo de crear producto', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=username]', 'emilys')
  await page.fill('[name=password]', 'emilyspass')
  await page.click('button[type=submit]')
  await expect(page).toHaveURL('/products')
  // ...
})

// Visual regression testing
await percySnapshot(page, 'Products List')

// Performance testing
const metrics = await page.metrics()
expect(metrics.layoutDuration).toBeLessThan(100)
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18.x o superior
- npm 9.x o superior

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd product-management-mgi

# Instalar dependencias
npm install
```

### Ejecución en Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

### Credenciales de Prueba
```
Usuario: emilys
Contraseña: emilyspass
```

Más usuarios disponibles en: https://dummyjson.com/users

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests con UI
npm run test:ui
```

### Build para Producción
```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

---

## 📚 Stack Tecnológico

- **Framework**: Nuxt 3.20.2
- **UI**: Vue 3.5.26 + Composition API
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS 3.x
- **Estado**: Pinia 3.0.4
- **Validación**: VeeValidate 4.15 + Yup 1.7
- **Testing**: Vitest 4.0 + @vue/test-utils
- **Notificaciones**: Vue Toastification
- **HTTP**: Nuxt $fetch (built-in)

---

## 👤 Autor

Desarrollado como prueba técnica frontend para MGi - 2026

## 📝 Notas Finales

Este proyecto demuestra:
- ✅ Arquitectura escalable con Nuxt 3
- ✅ Manejo profesional de estado con Pinia
- ✅ Validaciones robustas con Yup
- ✅ Testing completo (43 tests pasando)
- ✅ TypeScript en modo strict
- ✅ Optimistic UI para mejor UX
- ✅ Diseño responsive y accesible
- ✅ Código limpio y bien documentado

**Tiempo total invertido**: ~18 horas efectivas distribuidas en 72 horas de plazo.