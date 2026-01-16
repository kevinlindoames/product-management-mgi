<!-- pages/products/[id]/index.vue -->
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
  fetchProductById,
  deleteProduct
} = useProducts()

// Estado para la imagen seleccionada en la galería
const selectedImageIndex = ref(0)

// Estado para confirmación de eliminación
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

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

// Manejar eliminación
const handleDelete = async () => {
  isDeleting.value = true
  try {
    await deleteProduct(productId.value)
    toast.success('Producto eliminado exitosamente')
    showDeleteConfirm.value = false
    
    setTimeout(() => {
      router.push('/products')
    }, 1000)
  } catch (error) {
    toast.error('Error al eliminar el producto')
  } finally {
    isDeleting.value = false
  }
}

// Formatear fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
    <div v-else-if="product">
      <!-- Información principal -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
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
            <!-- Categoría y SKU -->
            <div class="flex items-center gap-2">
              <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full uppercase tracking-wide">
                {{ product.category }}
              </span>
              <span class="text-xs text-gray-500">SKU: {{ product.sku }}</span>
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
              <span class="text-sm text-gray-500">({{ product.reviews.length }} reseñas)</span>
            </div>

            <!-- Tags -->
            <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-2">
              <span 
                v-for="tag in product.tags" 
                :key="tag"
                class="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{{ tag }}
              </span>
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
              <p class="text-sm text-gray-500 mt-1">
                {{ product.availabilityStatus }}
              </p>
            </div>

            <!-- Descripción -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
              <p class="text-gray-600 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Detalles del producto -->
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

              <!-- Peso -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">Peso</p>
                <p class="text-xl font-semibold text-gray-900">
                  {{ product.weight }} kg
                </p>
              </div>

              <!-- Cantidad mínima -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500 mb-1">Pedido mínimo</p>
                <p class="text-xl font-semibold text-gray-900">
                  {{ product.minimumOrderQuantity }} unid.
                </p>
              </div>
            </div>

            <!-- Dimensiones -->
            <div v-if="product.dimensions" class="bg-blue-50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-blue-900 mb-2">Dimensiones</h3>
              <div class="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span class="text-blue-700">Ancho:</span>
                  <span class="font-medium text-blue-900 ml-1">{{ product.dimensions.width }} cm</span>
                </div>
                <div>
                  <span class="text-blue-700">Alto:</span>
                  <span class="font-medium text-blue-900 ml-1">{{ product.dimensions.height }} cm</span>
                </div>
                <div>
                  <span class="text-blue-700">Prof:</span>
                  <span class="font-medium text-blue-900 ml-1">{{ product.dimensions.depth }} cm</span>
                </div>
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
                Editar
              </UiBaseButton>

              <UiBaseButton
                @click="goBack"
                variant="secondary"
                class="flex-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </UiBaseButton>

              <UiBaseButton
                @click="showDeleteConfirm = true"
                variant="danger"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </UiBaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Información adicional en tabs -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Información de envío y garantía -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Información de Envío y Garantía</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p class="font-medium text-gray-900">Envío</p>
                <p class="text-sm text-gray-600">{{ product.shippingInformation }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p class="font-medium text-gray-900">Garantía</p>
                <p class="text-sm text-gray-600">{{ product.warrantyInformation }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <div>
                <p class="font-medium text-gray-900">Devoluciones</p>
                <p class="text-sm text-gray-600">{{ product.returnPolicy }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Reseñas de Clientes ({{ product.reviews.length }})
          </h3>
          
          <div v-if="product.reviews.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
            <div 
              v-for="(review, index) in product.reviews" 
              :key="index"
              class="pb-4 border-b border-gray-100 last:border-0"
            >
              <!-- Rating -->
              <div class="flex items-center gap-2 mb-2">
                <div class="flex">
                  <svg 
                    v-for="i in 5" 
                    :key="i"
                    class="w-4 h-4"
                    :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ review.rating }}/5</span>
              </div>

              <!-- Comentario -->
              <p class="text-gray-700 text-sm mb-2">{{ review.comment }}</p>

              <!-- Reviewer info -->
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span class="font-medium">{{ review.reviewerName }}</span>
                <span>{{ formatDate(review.date) }}</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-sm">No hay reseñas todavía</p>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación de eliminación -->
      <div 
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
              <p class="text-sm text-gray-600">Esta acción no se puede deshacer</p>
            </div>
          </div>

          <p class="text-gray-700 mb-6">
            ¿Estás seguro de que deseas eliminar <strong>"{{ product.title }}"</strong>?
          </p>

          <div class="flex gap-3">
            <UiBaseButton
              @click="handleDelete"
              variant="danger"
              :loading="isDeleting"
              :disabled="isDeleting"
              class="flex-1"
            >
              {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar' }}
            </UiBaseButton>
            <UiBaseButton
              @click="showDeleteConfirm = false"
              variant="secondary"
              :disabled="isDeleting"
              class="flex-1"
            >
              Cancelar
            </UiBaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>