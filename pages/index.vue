<!-- pages/index.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

// Redirigir automáticamente a productos
navigateTo('/products')
</script>

<template>
  <div></div>
</template>