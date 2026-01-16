<!-- components/products/ProductCard.vue -->
<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

const stockStatus = computed(() => {
  if (props.product.stock === 0) return { text: 'Agotado', color: 'text-red-600 bg-red-50 border-red-200' }
  if (props.product.stock < 10) return { text: 'Bajo stock', color: 'text-orange-600 bg-orange-50 border-orange-200' }
  return { text: 'En stock', color: 'text-green-600 bg-green-50 border-green-200' }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
    <!-- Imagen -->
    <NuxtLink :to="`/products/${product.id}`" class="block">
      <div class="aspect-square bg-gray-100 overflow-hidden relative">
        <img 
          :src="product.thumbnail" 
          :alt="product.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div v-if="product.discountPercentage > 0" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{{ product.discountPercentage.toFixed(0) }}%
        </div>
      </div>
    </NuxtLink>

    <!-- Contenido -->
    <div class="p-4">
      <!-- Categoría y Rating -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {{ product.category }}
        </span>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span class="text-sm font-medium text-gray-700">{{ product.rating }}</span>
        </div>
      </div>

      <!-- Título -->
      <NuxtLink :to="`/products/${product.id}`">
        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors">
          {{ product.title }}
        </h3>
      </NuxtLink>

      <!-- Precio -->
      <div class="mb-3">
        <span class="text-2xl font-bold text-gray-900">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Stock -->
      <div class="mb-4">
        <span 
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
          :class="stockStatus.color"
        >
          <span class="w-1.5 h-1.5 rounded-full mr-1.5" 
                :class="product.stock > 0 ? 'bg-current' : ''"
          ></span>
          {{ stockStatus.text }} ({{ product.stock }})
        </span>
      </div>

      <!-- Acciones -->
      <div class="flex gap-2">
        <NuxtLink 
          :to="`/products/${product.id}`"
          class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-center"
        >
          Ver Detalle
        </NuxtLink>
        <NuxtLink 
          :to="`/products/${product.id}/edit`"
          class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center"
          title="Editar producto"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>