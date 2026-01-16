<!-- pages/products/[id].vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const productId = computed(() => parseInt(route.params.id as string))

const {
  currentProduct: product,
  isLoading,
  error,
  fetchProductById
} = useProducts()

// Estado para la imagen seleccionada en la galería
const selectedImageIndex = ref(0)

// Cargar producto
onMounted(async () => {
  try {
    await fetchProductById(productId.value)
  } catch (e) {
    toast.error('Error al cargar el producto')
  }
})

// SEO dinámico
watchEffect(() => {
  if (product.value) {
    useSeoMeta({
      title: `${product.value.title} - Product Management`,
      description: product.value.description
    })
  }
})

// Formatear precio
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Estado del stock
const stockStatus = computed(() => {
  if (!product.value) return { text: '', color: '' }
  if (product.value.stock === 0) return { 
    text: 'Agotado', 
    color: 'text-red-600 bg-red-50 border-red-200' 
  }
  if (product.value.stock < 10) return { 
    text: 'Bajo stock', 
    color: 'text-orange-600 bg-orange-50 border-orange-200' 
  }
  return { 
    text: 'En stock', 
    color: 'text-green-600 bg-green-50 border-green-200' 
  }
})

// Volver al listado
const goBack = () => {
  router.push('/products')
}

// Ir a editar
const goToEdit = () => {
  router.push(`/products/${productId.value}/edit`)
}
</script>

<template>
  <div>
    <!-- Breadcrumbs -->
    <nav class="mb-6 flex items-center gap-2 text-sm">
      <NuxtLink 
        to="/products" 
        class="text-blue-600 hover:text-blue-700 hover:underline"
      >
        Productos
      </NuxtLink>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span class="text-gray-600">
        {{ product?.title || 'Cargando...' }}
      </span>
    </nav>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div class="aspect-square bg-gray-200 rounded-lg"></div>
          <div class="grid grid-cols-4 gap-2">
            <div v-for="i in 4" :key="i" class="aspect-square bg-gray-200 rounded"></div>
          </div>
        </div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
          <div class="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
      <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error al cargar el producto</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <UiBaseButton @click="goBack" variant="secondary">
        Volver al listado
      </UiBaseButton>
    </div>

    <!-- Contenido del producto -->
    <div v-else-if="product" class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        <!-- Galería de imágenes -->
        <div class="space-y-4">
          <!-- Imagen principal -->
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              :src="product.images[selectedImageIndex]" 
              :alt="product.title"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Thumbnails -->
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImageIndex = index"
              class="aspect-square bg-gray-100 rounded overflow-hidden border-2 transition-all hover:border-blue-300"
              :class="selectedImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'"
            >
              <img 
                :src="image" 
                :alt="`${product.title} - imagen ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Información del producto -->
        <div class="space-y-6">
          <!-- Categoría -->
          <div>
            <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full uppercase tracking-wide">
              {{ product.category }}
            </span>
          </div>

          <!-- Título -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
            {{ product.title }}
          </h1>

          <!-- Rating -->
          <div class="flex items-center gap-2">
            <div class="flex items-center">
              <svg 
                v-for="i in 5" 
                :key="i"
                class="w-5 h-5"
                :class="i <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-lg font-medium text-gray-700">{{ product.rating }}</span>
            <span class="text-gray-400">/ 5</span>
          </div>

          <!-- Precio -->
          <div class="py-4 border-y border-gray-200">
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </span>
              <span v-if="product.discountPercentage > 0" class="text-lg text-green-600 font-medium">
                -{{ product.discountPercentage.toFixed(0) }}% OFF
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Detalles -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Stock -->
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-500 mb-1">Stock disponible</p>
              <p class="text-2xl font-bold text-gray-900">{{ product.stock }}</p>
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2"
                :class="stockStatus.color"
              >
                {{ stockStatus.text }}
              </span>
            </div>

            <!-- Marca -->
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-500 mb-1">Marca</p>
              <p class="text-xl font-semibold text-gray-900">
                {{ product.brand || 'Sin marca' }}
              </p>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <UiBaseButton
              @click="goToEdit"
              variant="primary"
              class="flex-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Producto
            </UiBaseButton>

            <UiBaseButton
              @click="goBack"
              variant="secondary"
              class="flex-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Listado
            </UiBaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>