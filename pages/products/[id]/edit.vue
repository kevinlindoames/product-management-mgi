<!-- pages/products/[id]/edit.vue -->
<script setup lang="ts">
import type { ProductFormData } from '~/utils/validations'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const productId = computed(() => parseInt(route.params.id as string))

const {
  currentProduct: product,
  isLoading: isLoadingProduct,
  fetchProductById,
  updateProduct
} = useProducts()

const isSaving = ref(false)

// Cargar producto al montar
onMounted(async () => {
  try {
    await fetchProductById(productId.value)
  } catch (error) {
    toast.error('Error al cargar el producto')
    router.push('/products')
  }
})

// SEO dinámico
watchEffect(() => {
  if (product.value) {
    useSeoMeta({
      title: `Editar ${product.value.title} - Product Management`,
      description: `Editar información del producto ${product.value.title}`
    })
  }
})

// Manejar envío del formulario
const handleSubmit = async (formData: ProductFormData) => {
  isSaving.value = true
  
  try {
    const updatedProduct = await updateProduct(productId.value, formData)
    
    toast.success(`Producto "${updatedProduct.title}" actualizado exitosamente`)
    
    // Redirigir al detalle después de 1 segundo
    setTimeout(() => {
      router.push(`/products/${productId.value}`)
    }, 1000)
    
  } catch (error: any) {
    toast.error(error.message || 'Error al actualizar el producto')
  } finally {
    isSaving.value = false
  }
}

// Manejar cancelación
const handleCancel = () => {
  router.push(`/products/${productId.value}`)
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
      <NuxtLink 
        v-if="product"
        :to="`/products/${productId}`" 
        class="text-blue-600 hover:text-blue-700 hover:underline"
      >
        {{ product.title }}
      </NuxtLink>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span class="text-gray-600">Editar</span>
    </nav>

    <!-- Loading skeleton -->
    <div v-if="isLoadingProduct" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div class="bg-white rounded-lg border border-gray-100 p-6 md:p-8">
        <div class="space-y-6">
          <div class="h-12 bg-gray-200 rounded"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de edición -->
    <div v-else-if="product">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Editar Producto</h1>
        <p class="text-gray-600">
          Actualiza la información de "{{ product.title }}"
        </p>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        <ProductsProductForm
          :product="product"
          :is-loading="isSaving"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>

      <!-- Nota informativa -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">Nota sobre la API de prueba</p>
            <p>Los cambios son simulados y no se guardan permanentemente en el servidor de DummyJSON.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>