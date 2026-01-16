// composables/useProducts.ts
import type { Product, ProductsResponse, CreateProductDto } from '~/types'

export const useProducts = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // Estado reactivo
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // Headers con autenticación
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.token}`
  })

  // Obtener todos los productos
  const fetchProducts = async (limit: number = 30, skip: number = 0) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ProductsResponse>(
        `/products?limit=${limit}&skip=${skip}`,
        {
          baseURL: config.public.apiBase,
          headers: getHeaders()
        }
      )
      
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

  // Buscar productos
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      return fetchProducts()
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ProductsResponse>(
        `/products/search?q=${encodeURIComponent(query)}`,
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
      
      return response
    } catch (e: any) {
      error.value = e.data?.message || 'Error al actualizar el producto'
      console.error('Error updating product:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Ordenar productos localmente
  const sortByPrice = (ascending: boolean = true) => {
    products.value = [...products.value].sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price
    })
  }

  // Filtrar por categoría
  const filterByCategory = (category: string) => {
    if (!category) return fetchProducts()
    
    products.value = products.value.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    )
  }

  return {
    // State
    products,
    currentProduct,
    isLoading,
    error,
    total,
    // Methods
    fetchProducts,
    searchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    sortByPrice,
    filterByCategory
  }
}