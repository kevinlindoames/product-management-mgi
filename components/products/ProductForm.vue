<!-- components/products/ProductForm.vue -->
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { productSchema, type ProductFormData } from '~/utils/validations'
import type { Product } from '~/types'

interface Props {
  product?: Product | null
  isLoading?: boolean
}

interface Emits {
  (e: 'submit', data: ProductFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  isLoading: false
})

const emit = defineEmits<Emits>()

// Configurar formulario con VeeValidate
const { defineField, handleSubmit, errors, values } = useForm({
  validationSchema: productSchema,
  initialValues: props.product ? {
    title: props.product.title,
    description: props.product.description,
    price: props.product.price,
    stock: props.product.stock,
    category: props.product.category,
    brand: props.product.brand || ''
  } : {
    title: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    brand: ''
  }
})

// Definir campos
const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [price, priceAttrs] = defineField('price')
const [stock, stockAttrs] = defineField('stock')
const [category, categoryAttrs] = defineField('category')
const [brand, brandAttrs] = defineField('brand')

// Categorías predefinidas (podrías obtenerlas de la API)
const categories = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches'
]

// Enviar formulario
const onSubmit = handleSubmit((values) => {
  emit('submit', values as ProductFormData)
})

// Cancelar
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <!-- Título -->
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
        Título del Producto <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="title"
        v-bind="titleAttrs"
        type="text"
        placeholder="Ej: iPhone 15 Pro Max"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        :class="{ 'border-red-500': errors.title }"
        :disabled="isLoading"
      />
      <p v-if="errors.title" class="mt-1.5 text-sm text-red-500">
        {{ errors.title }}
      </p>
    </div>

    <!-- Descripción -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
        Descripción <span class="text-red-500">*</span>
      </label>
      <textarea
        id="description"
        v-model="description"
        v-bind="descriptionAttrs"
        rows="4"
        placeholder="Describe las características principales del producto..."
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        :class="{ 'border-red-500': errors.description }"
        :disabled="isLoading"
      />
      <p v-if="errors.description" class="mt-1.5 text-sm text-red-500">
        {{ errors.description }}
      </p>
    </div>

    <!-- Grid de 2 columnas para campos numéricos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Precio -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
          Precio (USD) <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            id="price"
            v-model.number="price"
            v-bind="priceAttrs"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            :class="{ 'border-red-500': errors.price }"
            :disabled="isLoading"
          />
        </div>
        <p v-if="errors.price" class="mt-1.5 text-sm text-red-500">
          {{ errors.price }}
        </p>
      </div>

      <!-- Stock -->
      <div>
        <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
          Stock <span class="text-red-500">*</span>
        </label>
        <input
          id="stock"
          v-model.number="stock"
          v-bind="stockAttrs"
          type="number"
          min="0"
          placeholder="0"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          :class="{ 'border-red-500': errors.stock }"
          :disabled="isLoading"
        />
        <p v-if="errors.stock" class="mt-1.5 text-sm text-red-500">
          {{ errors.stock }}
        </p>
      </div>
    </div>

    <!-- Categoría -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
        Categoría <span class="text-red-500">*</span>
      </label>
      <select
        id="category"
        v-model="category"
        v-bind="categoryAttrs"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        :class="{ 'border-red-500': errors.category }"
        :disabled="isLoading"
      >
        <option value="">Selecciona una categoría</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }}
        </option>
      </select>
      <p v-if="errors.category" class="mt-1.5 text-sm text-red-500">
        {{ errors.category }}
      </p>
    </div>

    <!-- Marca (opcional) -->
    <div>
      <label for="brand" class="block text-sm font-medium text-gray-700 mb-2">
        Marca <span class="text-gray-400 text-xs">(Opcional)</span>
      </label>
      <input
        id="brand"
        v-model="brand"
        v-bind="brandAttrs"
        type="text"
        placeholder="Ej: Apple, Samsung, etc."
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        :class="{ 'border-red-500': errors.brand }"
        :disabled="isLoading"
      />
      <p v-if="errors.brand" class="mt-1.5 text-sm text-red-500">
        {{ errors.brand }}
      </p>
    </div>

    <!-- Botones de acción -->
    <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
      <UiBaseButton
        type="submit"
        variant="primary"
        :loading="isLoading"
        :disabled="isLoading"
        class="sm:flex-1"
      >
        <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ isLoading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto') }}
      </UiBaseButton>
      
      <UiBaseButton
        type="button"
        variant="secondary"
        @click="handleCancel"
        :disabled="isLoading"
        class="sm:flex-1"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Cancelar
      </UiBaseButton>
    </div>
  </form>
</template>