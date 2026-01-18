// composables/useProducts.ts
import type { Product, ProductsResponse, CreateProductDto, PaginationParams } from '~/types'

export const useProducts = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // Estado reactivo
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const categories = ref<string[]>([])

  // Helper para mostrar toast de forma segura
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    if (process.client) {
      const toast = useToast()
      toast[type](message)
    }
  }

  // Headers con autenticación
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.token}`
  })

  // Obtener categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await $fetch('/products/category-list', {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      }) as string[]
      
      categories.value = response
      return response
    } catch (e: any) {
      console.error('Error fetching categories:', e)
      showToast('error', 'Error al cargar las categorías')
      return []
    }
  }

  // Obtener productos con paginación y filtros
  const fetchProducts = async (params: PaginationParams = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.skip) queryParams.append('skip', params.skip.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.order) queryParams.append('order', params.order)

      const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await $fetch(url, {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      }) as ProductsResponse
      
      products.value = response.products
      total.value = response.total
      
      return response
    } catch (e: any) {
      const errorMessage = e.data?.message || 'Error al cargar productos'
      error.value = errorMessage
      showToast('error', errorMessage)
      console.error('Error fetching products:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Obtener productos por categoría
  const fetchProductsByCategory = async (category: string, params: PaginationParams = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.skip) queryParams.append('skip', params.skip.toString())

      const url = `/products/category/${category}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await $fetch(url, {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      }) as ProductsResponse
      
      products.value = response.products
      total.value = response.total
      
      return response
    } catch (e: any) {
      const errorMessage = e.data?.message || 'Error al filtrar productos'
      error.value = errorMessage
      showToast('error', errorMessage)
      console.error('Error fetching products by category:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Buscar productos
  const searchProducts = async (query: string, params: PaginationParams = {}) => {
    if (!query.trim()) {
      return fetchProducts(params)
    }

    isLoading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      queryParams.append('q', query)
      
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.skip) queryParams.append('skip', params.skip.toString())

      const response = await $fetch(`/products/search?${queryParams.toString()}`, {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      }) as ProductsResponse
      
      products.value = response.products
      total.value = response.total
      
      if (response.products.length === 0) {
        showToast('info', 'No se encontraron productos con esa búsqueda')
      } else {
        showToast('success', `Se encontraron ${response.products.length} producto(s)`)
      }
      
      return response
    } catch (e: any) {
      const errorMessage = e.data?.message || 'Error al buscar productos'
      error.value = errorMessage
      showToast('error', errorMessage)
      console.error('Error searching products:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Obtener producto por ID
  const fetchProductById = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/products/${id}`, {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      }) as Product
      
      currentProduct.value = response
      return response
    } catch (e: any) {
      const errorMessage = e.data?.message || 'Error al cargar el producto'
      error.value = errorMessage
      showToast('error', errorMessage)
      console.error('Error fetching product:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Crear producto
  const createProduct = async (productData: CreateProductDto) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/products/add', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: getHeaders(),
        body: productData
      }) as Product
      
      // Optimistic UI: agregar al principio de la lista
      products.value.unshift(response)
      total.value += 1
      
      showToast('success', '¡Producto creado exitosamente!')
      
      return response
    } catch (e: any) {
      const errorMessage = e.data?.message || 'Error al crear el producto'
      error.value = errorMessage
      showToast('error', errorMessage)
      console.error('Error creating product:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar producto
  const updateProduct = async (id: number, productData: Partial<CreateProductDto>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/products/${id}`, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        headers: getHeaders(),
        body: productData
      }) as Product
      
      // Optimistic UI: actualizar en la lista
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...response }
      }
      
      // Actualizar currentProduct si es el mismo
      if (currentProduct.value?.id === id) {
        currentProduct.value = { ...currentProduct.value, ...response }
      }
      
      showToast('success', '¡Producto actualizado exitosamente!')
      
      return response
    } catch (e: any) {
      const errorMessage = e.data?.message || 'Error al actualizar el producto'
      error.value = errorMessage
      showToast('error', errorMessage)
      console.error('Error updating product:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar producto
  const deleteProduct = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/products/${id}`, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: getHeaders()
      }) as Product
      
      // Optimistic UI: remover de la lista
      products.value = products.value.filter(p => p.id !== id)
      total.value -= 1
      
      showToast('success', 'Producto eliminado exitosamente')
      
      return response
    } catch (e: any) {
      const errorMessage = e.data?.message || 'Error al eliminar el producto'
      error.value = errorMessage
      showToast('error', errorMessage)
      console.error('Error deleting product:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    products,
    currentProduct,
    isLoading,
    error,
    total,
    categories,
    // Methods
    fetchProducts,
    fetchProductsByCategory,
    searchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories
  }
}