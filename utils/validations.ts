// utils/validations.ts
import * as yup from 'yup'

// Esquema de validación para productos
export const productSchema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  
  description: yup
    .string()
    .required('La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  
  price: yup
    .number()
    .required('El precio es requerido')
    .positive('El precio debe ser mayor a 0')
    .typeError('El precio debe ser un número válido'),
  
  stock: yup
    .number()
    .required('El stock es requerido')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .typeError('El stock debe ser un número válido'),
  
  category: yup
    .string()
    .required('La categoría es requerida')
    .min(2, 'La categoría debe tener al menos 2 caracteres'),
  
  brand: yup
    .string()
    .optional()
    .min(2, 'La marca debe tener al menos 2 caracteres')
})

export type ProductFormData = yup.InferType<typeof productSchema>