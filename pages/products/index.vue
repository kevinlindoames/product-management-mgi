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
  categories,
  fetchProducts, 
  fetchProductsByCategory,
  searchProducts,
  fetchCategories
} = useProducts()

const toast = useToast()

// Estado de filtros y paginación
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(20)
const sortField = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedCategory = ref('')

// Páginas totales
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))

// Cargar productos al montar
onMounted(async () => {
  try {
    await Promise.all([
      fetchProducts({ limit: itemsPerPage.value, skip: 0 }),
      fetchCategories()
    ])
  } catch (e) {
    toast.error('Error al cargar los productos')
  }
})

// Función para cargar productos con filtros actuales
const loadProducts = async () => {
  const skip = (currentPage.value - 1) * itemsPerPage.value
  
  try {
    if (searchQuery.value) {
      // Búsqueda
      await searchProducts(searchQuery.value, {
        limit: itemsPerPage.value,
        skip,
        sortBy: sortField.value || undefined,
        order: sortOrder.value || undefined
      })
    } else if (selectedCategory.value) {
      // Filtro por categoría
      await fetchProductsByCategory(selectedCategory.value, {
        limit: itemsPerPage.value,
        skip
      })
    } else {
      // Todos los productos
      await fetchProducts({
        limit: itemsPerPage.value,
        skip,
        sortBy: sortField.value || undefined,
        order: sortOrder.value || undefined
      })
    }
  } catch (e) {
    toast.error('Error al cargar productos')
  }
}

// Manejar búsqueda
const handleSearch = async (query: string) => {
  searchQuery.value = query
  selectedCategory.value = '' // Limpiar categoría al buscar
  currentPage.value = 1
  await loadProducts()
  
  if (query) {
    toast.info(`${products.value.length} productos encontrados`)
  }
}

// Manejar ordenamiento
const handleSort = async (field: string, order: 'asc' | 'desc') => {
  sortField.value = field
  sortOrder.value = order
  currentPage.value = 1
  await loadProducts()
  
  const orderText = order === 'asc' ? 'ascendente' : 'descendente'
  const fieldText = field === 'price' ? 'precio' : field === 'rating' ? 'calificación' : 'nombre'
  toast.success(`Ordenado por ${fieldText} ${orderText}`)
}

// Manejar filtro por categoría
const handleFilterCategory = async (category: string) => {
  selectedCategory.value = category
  searchQuery.value = '' // Limpiar búsqueda al filtrar
  currentPage.value = 1
  await loadProducts()
  
  if (category) {
    toast.info(`Filtrando por categoría: ${category}`)
  }
}

// Limpiar todos los filtros
const handleClearFilters = async () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortField.value = ''
  sortOrder.value = 'asc'
  currentPage.value = 1
  await loadProducts()
  toast.info('Filtros limpiados')
}

// Cambiar página
const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Páginas visibles en el paginador
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>

<template>
  <div>
    <!-- Header con título y botón de crear -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Productos</h2>
        <p class="text-gray-600 mt-1">
          {{ total }} productos disponibles
          <span v-if="selectedCategory" class="text-blue-600">
            en {{ selectedCategory }}
          </span>
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
      :categories="categories"
      @search="handleSearch"
      @sort="handleSort"
      @filter-category="handleFilterCategory"
      @clear-filters="handleClearFilters"
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
            @click="loadProducts" 
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
          v-if="searchQuery || selectedCategory"
          @click="handleClearFilters"
          variant="secondary"
        >
          Limpiar filtros
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

    <!-- Paginación -->
    <div v-if="!isLoading && products.length > 0 && totalPages > 1" class="mt-8 flex justify-center">
      <nav class="inline-flex rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Anterior -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Primera página -->
        <button
          v-if="visiblePages[0] > 1"
          @click="goToPage(1)"
          class="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border-r border-gray-200"
        >
          1
        </button>
        
        <span v-if="visiblePages[0] > 2" class="px-4 py-2 text-sm text-gray-500 bg-white border-r border-gray-200">
          ...
        </span>

        <!-- Páginas visibles -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 text-sm font-medium border-r border-gray-200',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>

        <!-- Última página -->
        <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="px-4 py-2 text-sm text-gray-500 bg-white border-r border-gray-200">
          ...
        </span>
        
        <button
          v-if="visiblePages[visiblePages.length - 1] < totalPages"
          @click="goToPage(totalPages)"
          class="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border-r border-gray-200"
        >
          {{ totalPages }}
        </button>

        <!-- Siguiente -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>

    <!-- Info de paginación -->
    <div v-if="!isLoading && products.length > 0" class="mt-4 text-center text-sm text-gray-600">
      Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} - 
      {{ Math.min(currentPage * itemsPerPage, total) }} de {{ total }} productos
    </div>
  </div>
</template>