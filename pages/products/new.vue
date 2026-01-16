<!-- pages/products/new.vue -->
<script setup lang="ts">
import type { ProductFormData } from '~/utils/validations'

definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Crear Producto - Product Management',
  description: 'Crear un nuevo producto en el sistema'
})

const router = useRouter()
const toast = useToast()
const { createProduct, isLoading } = useProducts()

// Manejar envío del formulario
const handleSubmit = async (formData: ProductFormData) => {
  try {
    const newProduct = await createProduct(formData)
    
    toast.success(`Producto "${newProduct.title}" creado exitosamente`)
    
    // Redirigir al listado después de 1 segundo
    setTimeout(() => {
      router.push('/products')
    }, 1000)
    
  } catch (error: any) {
    toast.error(error.message || 'Error al crear el producto')
  }
}

// Manejar cancelación
const handleCancel = () => {
  router.push('/products')
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
      <span class="text-gray-600">Nuevo Producto</span>
    </nav>

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Producto</h1>
      <p class="text-gray-600">
        Completa el formulario para agregar un nuevo producto al catálogo
      </p>
    </div>

    <!-- Formulario -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
      <ProductsProductForm
        :is-loading="isLoading"
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
          <p>Esta aplicación usa DummyJSON como API de prueba. Los productos creados son simulados y no se guardan permanentemente en el servidor.</p>
        </div>
      </div>
    </div>
  </div>
</template>