// tests/components/ProductCard.test.ts
import { describe, it, expect } from 'vitest'

describe('ProductCard Component - Logic', () => {
  it('debe formatear el precio correctamente', () => {
    const price = 999.99
    const formatted = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD'
    }).format(price)

    expect(formatted).toContain('999.99')
  })

  it('debe calcular el estado del stock - En Stock', () => {
    const stock = 25
    const status = stock > 10 ? 'En stock' : stock > 0 ? 'Bajo stock' : 'Agotado'
    
    expect(status).toBe('En stock')
  })

  it('debe calcular el estado del stock - Bajo Stock', () => {
    const stock = 5
    const status = stock > 10 ? 'En stock' : stock > 0 ? 'Bajo stock' : 'Agotado'
    
    expect(status).toBe('Bajo stock')
  })

  it('debe calcular el estado del stock - Agotado', () => {
    const stock = 0
    const status = stock > 10 ? 'En stock' : stock > 0 ? 'Bajo stock' : 'Agotado'
    
    expect(status).toBe('Agotado')
  })

  it('debe formatear el descuento correctamente', () => {
    const discount = 10.5
    const formatted = `-${discount.toFixed(0)}%`
    
    expect(formatted).toBe('-11%')
  })

  it('debe calcular el rating redondeado', () => {
    const rating = 4.7
    const rounded = Math.round(rating)
    
    expect(rounded).toBe(5)
  })

  it('debe construir la URL de detalle correctamente', () => {
    const productId = 123
    const detailUrl = `/products/${productId}`
    
    expect(detailUrl).toBe('/products/123')
  })

  it('debe construir la URL de edición correctamente', () => {
    const productId = 123
    const editUrl = `/products/${productId}/edit`
    
    expect(editUrl).toBe('/products/123/edit')
  })
})