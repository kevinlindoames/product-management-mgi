// stores/auth.ts
import { defineStore } from 'pinia'
import type { User, LoginCredentials, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<AuthResponse>('/auth/login', {
        baseURL: 'https://dummyjson.com',
        method: 'POST',
        body: {
          username: credentials.username,
          password: credentials.password,
          expiresInMins: 60
        }
      })

      // Guardar token y usuario (la API devuelve accessToken)
      token.value = response.accessToken
      user.value = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image
      }

      // Persistir en localStorage
      if (process.client) {
        localStorage.setItem('auth_token', response.accessToken)
        localStorage.setItem('user', JSON.stringify(user.value))
      }

      return true
    } catch (e: any) {
      console.error('Login error:', e)
      error.value = e.data?.message || 'Usuario o contraseña incorrectos'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    error.value = null

    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }

    navigateTo('/login')
  }

  const initAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          token.value = storedToken
          user.value = JSON.parse(storedUser)
        } catch (e) {
          console.error('Error parsing stored user:', e)
          logout()
        }
      }
    }
  }

  return {
    // State
    token,
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
    initAuth
  }
})