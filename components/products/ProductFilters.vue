<!-- components/products/ProductFilters.vue -->
<script setup lang="ts">
interface Emits {
  (e: 'search', query: string): void
  (e: 'sort', field: string, order: 'asc' | 'desc'): void
  (e: 'filterCategory', category: string): void
  (e: 'clearFilters'): void
}

interface Props {
  categories?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => []
})

const emit = defineEmits<Emits>()

const searchQuery = ref('')
const selectedCategory = ref('')
const sortField = ref<'price' | 'title' | 'rating' | ''>('')
const sortOrder = ref<'asc' | 'desc' | ''>('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleSort = (field: 'price' | 'title' | 'rating', order: 'asc' | 'desc') => {
  sortField.value = field
  sortOrder.value = order
  emit('sort', field, order)
}

const handleCategoryChange = () => {
  emit('filterCategory', selectedCategory.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortField.value = ''
  sortOrder.value = ''
  emit('clearFilters')
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || sortField.value
})

// Formatear nombre de categoría
const formatCategoryName = (category: string) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
    <!-- Primera fila: Búsqueda y categoría -->
    <div class="flex flex-col lg:flex-row gap-4 mb-4">
      <!-- Búsqueda -->
      <div class="flex-1">
        <div class="relative">
          <svg 
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar productos por nombre..."
            @keyup="handleKeyup"
            class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Limpiar búsqueda"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Filtro de categoría -->
      <div class="lg:w-64">
        <select
          v-model="selectedCategory"
          @change="handleCategoryChange"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
        >
          <option value="">Todas las categorías</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ formatCategoryName(category) }}
          </option>
        </select>
      </div>

      <!-- Botón de búsqueda -->
      <UiBaseButton
        @click="handleSearch"
        variant="primary"
        class="lg:w-auto"
      >
        <svg class="w-5 h-5 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="hidden lg:inline">Buscar</span>
      </UiBaseButton>
    </div>

    <!-- Segunda fila: Ordenamiento -->
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-gray-600 font-medium">Ordenar por:</span>
      
      <!-- Precio -->
      <UiBaseButton
        @click="handleSort('price', 'asc')"
        :variant="sortField === 'price' && sortOrder === 'asc' ? 'primary' : 'secondary'"
        class="text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span class="ml-1">Precio ↑</span>
      </UiBaseButton>
      
      <UiBaseButton
        @click="handleSort('price', 'desc')"
        :variant="sortField === 'price' && sortOrder === 'desc' ? 'primary' : 'secondary'"
        class="text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        </svg>
        <span class="ml-1">Precio ↓</span>
      </UiBaseButton>

      <!-- Rating -->
      <UiBaseButton
        @click="handleSort('rating', 'desc')"
        :variant="sortField === 'rating' && sortOrder === 'desc' ? 'primary' : 'secondary'"
        class="text-sm"
      >
        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="ml-1">Mejor calificados</span>
      </UiBaseButton>

      <!-- Nombre -->
      <UiBaseButton
        @click="handleSort('title', 'asc')"
        :variant="sortField === 'title' && sortOrder === 'asc' ? 'primary' : 'secondary'"
        class="text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13m-10 4h7m-7 4h4" />
        </svg>
        <span class="ml-1">Nombre A-Z</span>
      </UiBaseButton>

      <!-- Limpiar filtros -->
      <UiBaseButton
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        variant="danger"
        class="text-sm ml-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="ml-1">Limpiar filtros</span>
      </UiBaseButton>
    </div>
    
    <!-- Indicadores de filtros activos -->
    <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
      <span class="text-xs text-gray-500 font-medium">Filtros activos:</span>
      
      <span v-if="searchQuery" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        "{{ searchQuery }}"
      </span>
      
      <span v-if="selectedCategory" class="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        {{ formatCategoryName(selectedCategory) }}
      </span>
      
      <span v-if="sortField" class="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        {{ sortField === 'price' ? 'Precio' : sortField === 'rating' ? 'Rating' : 'Nombre' }} 
        {{ sortOrder === 'asc' ? '↑' : '↓' }}
      </span>
    </div>
  </div>
</template>