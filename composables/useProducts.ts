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

  // Headers con autenticación
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.token}`
  })

  // Obtener categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await $fetch<string[]>(
        '/products/category-list',
        {
          baseURL: config.public.apiBase,
          headers: getHeaders()
        }
      )
      categories.value = response
      return response
    } catch (e: any) {
      console.error('Error fetching categories:', e)
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
      
      const response = await $fetch<ProductsResponse>(url, {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      })
      
      products.value = response.products
      total.value = response.total
      
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al cargar productos'
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
      
      const response = await $fetch<ProductsResponse>(url, {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      })
      
      products.value = response.products
      total.value = response.total
      
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al filtrar productos'
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

      const response = await $fetch<ProductsResponse>(
        `/products/search?${queryParams.toString()}`,
        {
          baseURL: config.public.apiBase,
          headers: getHeaders()
        }
      )
      
      products.value = response.products
      total.value = response.total
      
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al buscar productos'
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
      const response = await $fetch<Product>(`/products/${id}`, {
        baseURL: config.public.apiBase,
        headers: getHeaders()
      })
      currentProduct.value = response
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al cargar el producto'
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
      const response = await $fetch<Product>('/products/add', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: getHeaders(),
        body: productData
      })
      
      // Optimistic UI: agregar al principio de la lista
      products.value.unshift(response)
      total.value += 1
      
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al crear el producto'
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
      const response = await $fetch<Product>(`/products/${id}`, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        headers: getHeaders(),
        body: productData
      })
      
      // Optimistic UI: actualizar en la lista
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...response }
      }
      
      // Actualizar currentProduct si es el mismo
      if (currentProduct.value?.id === id) {
        currentProduct.value = { ...currentProduct.value, ...response }
      }
      
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al actualizar el producto'
      console.error('Error updating product:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar producto (simulado)
  const deleteProduct = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<Product>(`/products/${id}`, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: getHeaders()
      })
      
      // Optimistic UI: remover de la lista
      products.value = products.value.filter(p => p.id !== id)
      total.value -= 1
      
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al eliminar el producto'
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