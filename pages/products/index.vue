<!-- pages/products/index.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Productos - Product Management',
  description: 'Listado completo de productos disponibles en el sistema'
})

const { 
  products, 
  isLoading, 
  error,
  total,
  fetchProducts, 
  searchProducts,
  sortByPrice 
} = useProducts()

const toast = useToast()
const searchQuery = ref('')

// Cargar productos al montar el componente
onMounted(async () => {
  try {
    await fetchProducts()
  } catch (e) {
    toast.error('Error al cargar los productos')
  }
})

// Manejar búsqueda
const handleSearch = async (query: string) => {
  searchQuery.value = query
  try {
    if (query.trim()) {
      await searchProducts(query)
      toast.info(`Se encontraron ${products.value.length} productos`)
    } else {
      await fetchProducts()
    }
  } catch (e) {
    toast.error('Error al buscar productos')
  }
}

// Manejar ordenamiento
const handleSort = (ascending: boolean) => {
  sortByPrice(ascending)
  toast.success(`Productos ordenados por precio ${ascending ? 'ascendente' : 'descendente'}`)
}
</script>

<template>
  <div>
    <!-- Header con título y botón de crear -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Productos</h2>
        <p class="text-gray-600 mt-1">
          {{ total }} productos disponibles
        </p>
      </div>
      <NuxtLink to="/products/new">
        <UiBaseButton variant="primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Producto</span>
        </UiBaseButton>
      </NuxtLink>
    </div>

    <!-- Filtros y búsqueda -->
    <ProductsProductFilters 
      @search="handleSearch"
      @sort="handleSort"
    />

    <!-- Mensaje de error -->
    <div 
      v-if="error && !isLoading" 
      class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6"
    >
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <h3 class="text-red-800 font-semibold mb-1">Error al cargar productos</h3>
          <p class="text-red-700 text-sm">{{ error }}</p>
          <UiBaseButton 
            @click="fetchProducts" 
            variant="danger"
            class="mt-3"
          >
            Reintentar
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- Loading: Skeletons -->
    <div 
      v-if="isLoading" 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductsProductSkeleton v-for="i in 8" :key="i" />
    </div>

    <!-- Lista de productos -->
    <div 
      v-else-if="products.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductsProductCard 
        v-for="product in products" 
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Sin resultados -->
    <div 
      v-else-if="!isLoading && products.length === 0"
      class="bg-white rounded-lg shadow-sm p-12 text-center"
    >
      <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        No se encontraron productos
      </h3>
      <p class="text-gray-600 mb-6">
        {{ searchQuery ? `No hay resultados para "${searchQuery}"` : 'No hay productos disponibles en este momento' }}
      </p>
      <div class="flex gap-3 justify-center">
        <UiBaseButton 
          v-if="searchQuery"
          @click="handleSearch('')"
          variant="secondary"
        >
          Limpiar búsqueda
        </UiBaseButton>
        <NuxtLink to="/products/new">
          <UiBaseButton variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear primer producto
          </UiBaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>