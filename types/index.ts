// types/index.ts

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface LoginCredentials {
  username: string
  password: string
  expiresInMins?: number
}

export interface AuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CreateProductDto {
  title: string
  description: string
  price: number
  stock: number
  category: string
  brand?: string
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: number
}

export interface ApiError {
  message: string
  status?: number
}