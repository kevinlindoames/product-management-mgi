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

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Meta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: Meta
  thumbnail: string
  images: string[]
  // Campos opcionales para cuando se crea/edita
  isDeleted?: boolean
  deletedOn?: string
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

export interface PaginationParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}