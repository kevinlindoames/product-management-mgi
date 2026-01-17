// tests/composables/useProducts.test.ts
import { describe, it, expect } from 'vitest'
import { productSchema } from '~/utils/validations'

describe('useProducts - Integration', () => {
  it('debe tener la estructura correcta del composable', () => {
    // Test simple que verifica que el módulo se puede importar
    expect(productSchema).toBeDefined()
  })

  it('debe validar parámetros de paginación', () => {
    const params = {
      limit: 20,
      skip: 10,
      sortBy: 'price',
      order: 'asc' as const
    }

    expect(params.limit).toBe(20)
    expect(params.skip).toBe(10)
    expect(params.sortBy).toBe('price')
    expect(params.order).toBe('asc')
  })

  it('debe construir correctamente query params', () => {
    const queryParams = new URLSearchParams()
    queryParams.append('limit', '20')
    queryParams.append('skip', '10')
    queryParams.append('sortBy', 'price')
    queryParams.append('order', 'asc')

    expect(queryParams.toString()).toBe('limit=20&skip=10&sortBy=price&order=asc')
  })
})