<!-- layouts/default.vue -->
<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">PM</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">
              Product Management
            </h1>
          </div>
          
          <ClientOnly>
            <div v-if="authStore.user" class="flex items-center gap-4">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium text-gray-900">
                  {{ authStore.user.firstName }} {{ authStore.user.lastName }}
                </p>
                <p class="text-xs text-gray-500">@{{ authStore.user.username }}</p>
              </div>
              <img 
                v-if="authStore.user.image"
                :src="authStore.user.image" 
                :alt="authStore.user.username"
                class="w-10 h-10 rounded-full border-2 border-gray-200"
              />
              <UiBaseButton
                variant="secondary"
                @click="authStore.logout"
              >
                Cerrar Sesión
              </UiBaseButton>
            </div>
          </ClientOnly>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>