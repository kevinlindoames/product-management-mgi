<!-- components/products/ProductFilters.vue -->
<script setup lang="ts">
interface Emits {
  (e: 'search', query: string): void
  (e: 'sort', ascending: boolean): void
}

const emit = defineEmits<Emits>()

const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc' | ''>('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleSort = (order: 'asc' | 'desc') => {
  sortOrder.value = order
  emit('sort', order === 'asc')
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

// Buscar al presionar Enter
const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Búsqueda -->
      <div class="flex-1">
        <div class="relative">
          <!-- Ícono de búsqueda -->
          <svg 
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <!-- Input -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar productos por nombre..."
            @keyup="handleKeyup"
            class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          
          <!-- Botón limpiar (solo si hay texto) -->
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

      <!-- Botón de búsqueda -->
      <UiBaseButton
        @click="handleSearch"
        variant="primary"
        class="md:w-auto"
      >
        <svg class="w-5 h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="hidden md:inline">Buscar</span>
      </UiBaseButton>

      <!-- Separador visual -->
      <div class="hidden md:block w-px bg-gray-200"></div>

      <!-- Ordenamiento por precio -->
      <div class="flex gap-2">
        <UiBaseButton
          @click="handleSort('asc')"
          :variant="sortOrder === 'asc' ? 'primary' : 'secondary'"
          title="Ordenar por precio ascendente"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span class="ml-1">Precio ↑</span>
        </UiBaseButton>
        
        <UiBaseButton
          @click="handleSort('desc')"
          :variant="sortOrder === 'desc' ? 'primary' : 'secondary'"
          title="Ordenar por precio descendente"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span class="ml-1">Precio ↓</span>
        </UiBaseButton>
      </div>
    </div>
    
    <!-- Indicador de búsqueda activa -->
    <div v-if="searchQuery" class="mt-3 flex items-center gap-2 text-sm text-gray-600">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Buscando: <strong>"{{ searchQuery }}"</strong></span>
      <button @click="clearSearch" class="text-blue-600 hover:text-blue-700 underline">
        Limpiar
      </button>
    </div>
  </div>
</template>