// tests/utils/validations.test.ts
import { describe, it, expect } from 'vitest'
import { productSchema } from '~/utils/validations'

describe('Product Validations', () => {
  it('debe validar correctamente un producto válido', async () => {
    const validProduct = {
      title: 'iPhone 15 Pro',
      description: 'Smartphone de última generación con características premium',
      price: 999.99,
      stock: 50,
      category: 'smartphones',
      brand: 'Apple'
    }

    await expect(productSchema.validate(validProduct)).resolves.toBeTruthy()
  })

  it('debe rechazar título vacío', async () => {
    const invalidProduct = {
      title: '',
      description: 'Descripción válida del producto',
      price: 100,
      stock: 10,
      category: 'test'
    }

    await expect(productSchema.validate(invalidProduct))
      .rejects
      .toThrow('El título es requerido')
  })

  it('debe rechazar título muy corto', async () => {
    const invalidProduct = {
      title: 'AB',
      description: 'Descripción válida del producto',
      price: 100,
      stock: 10,
      category: 'test'
    }

    await expect(productSchema.validate(invalidProduct))
      .rejects
      .toThrow('El título debe tener al menos 3 caracteres')
  })

  it('debe rechazar descripción muy corta', async () => {
    const invalidProduct = {
      title: 'Producto Test',
      description: 'Corto',
      price: 100,
      stock: 10,
      category: 'test'
    }

    await expect(productSchema.validate(invalidProduct))
      .rejects
      .toThrow('La descripción debe tener al menos 10 caracteres')
  })

  it('debe rechazar precio negativo', async () => {
    const invalidProduct = {
      title: 'Producto Test',
      description: 'Descripción válida del producto',
      price: -10,
      stock: 10,
      category: 'test'
    }

    await expect(productSchema.validate(invalidProduct))
      .rejects
      .toThrow('El precio debe ser mayor a 0')
  })

  it('debe rechazar stock negativo', async () => {
    const invalidProduct = {
      title: 'Producto Test',
      description: 'Descripción válida del producto',
      price: 100,
      stock: -5,
      category: 'test'
    }

    await expect(productSchema.validate(invalidProduct))
      .rejects
      .toThrow('El stock no puede ser negativo')
  })

  it('debe aceptar stock en cero', async () => {
    const validProduct = {
      title: 'Producto Test',
      description: 'Descripción válida del producto',
      price: 100,
      stock: 0,
      category: 'test'
    }

    await expect(productSchema.validate(validProduct)).resolves.toBeTruthy()
  })

  it('debe aceptar marca opcional', async () => {
    const validProduct = {
      title: 'Producto Test',
      description: 'Descripción válida del producto',
      price: 100,
      stock: 10,
      category: 'test'
      // brand es opcional, no lo incluimos
    }

    await expect(productSchema.validate(validProduct)).resolves.toBeTruthy()
  })

  it('debe rechazar categoría vacía', async () => {
    const invalidProduct = {
      title: 'Producto Test',
      description: 'Descripción válida del producto',
      price: 100,
      stock: 10,
      category: ''
    }

    await expect(productSchema.validate(invalidProduct))
      .rejects
      .toThrow('La categoría es requerida')
  })

  it('debe rechazar precio no numérico', async () => {
    const invalidProduct = {
      title: 'Producto Test',
      description: 'Descripción válida del producto',
      price: 'not-a-number' as any,
      stock: 10,
      category: 'test'
    }

    await expect(productSchema.validate(invalidProduct))
      .rejects
      .toThrow('El precio debe ser un número válido')
  })
})