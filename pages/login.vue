<!-- pages/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth'
})

useSeoMeta({
  title: 'Login - Product Management',
  description: 'Inicia sesión en el sistema de gestión de productos'
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const validate = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''

  if (!form.username.trim()) {
    errors.username = 'El usuario es requerido'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (form.password.length < 4) {
    errors.password = 'La contraseña debe tener al menos 4 caracteres'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  const success = await authStore.login({
    username: form.username,
    password: form.password
  })

  if (success) {
    router.push('/products')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="max-w-md w-full">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p class="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <!-- Info de credenciales -->
        <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm font-semibold text-blue-900 mb-2">💡 Credenciales de prueba:</p>
          <div class="space-y-1">
            <p class="text-sm text-blue-800">
              <span class="font-medium">Usuario:</span> 
              <code class="ml-2 bg-blue-100 px-2 py-0.5 rounded text-blue-900">emilys</code>
            </p>
            <p class="text-sm text-blue-800">
              <span class="font-medium">Contraseña:</span> 
              <code class="ml-2 bg-blue-100 px-2 py-0.5 rounded text-blue-900">emilyspass</code>
            </p>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UiFormInput
            v-model="form.username"
            label="Usuario"
            placeholder="Ingresa tu usuario"
            :error="errors.username"
            :disabled="authStore.isLoading"
            required
          />

          <UiFormInput
            v-model="form.password"
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            :error="errors.password"
            :disabled="authStore.isLoading"
            required
          />

          <!-- Error del servidor -->
          <div 
            v-if="authStore.error" 
            class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
          >
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-800">{{ authStore.error }}</p>
          </div>

          <UiBaseButton
            type="submit"
            variant="primary"
            :loading="authStore.isLoading"
            :disabled="authStore.isLoading"
            full-width
          >
            {{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </UiBaseButton>
        </form>

        <!-- Footer -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-600 text-center">
            Más usuarios en 
            <a 
              href="https://dummyjson.com/users" 
              target="_blank"
              class="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              dummyjson.com/users
            </a>
          </p>
        </div>
      </div>

      <p class="text-center text-sm text-gray-600 mt-8">
        Prueba Técnica Frontend MGi © 2026
      </p>
    </div>
  </div>
</template>