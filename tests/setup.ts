// tests/setup.ts
import { vi } from 'vitest'
import { ref } from 'vue'

// Mock de process.env
if (!global.process.env) {
  global.process.env = {} as any
}
global.process.env.NODE_ENV = 'test'

// Mock de useRuntimeConfig
;(global as any).useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBase: 'https://dummyjson.com'
  }
}))

// Mock de navigateTo
;(global as any).navigateTo = vi.fn()

// Mock de $fetch
;(global as any).$fetch = vi.fn()

// Mock de ref
;(global as any).ref = ref

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

;(global as any).localStorage = localStorageMock
;(global.process as any).client = true