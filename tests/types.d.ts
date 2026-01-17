// tests/types.d.ts
import { Mock } from 'vitest'

declare global {
  var useRuntimeConfig: () => any
  var navigateTo: Mock
  var $fetch: Mock
  var ref: typeof import('vue').ref
  
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
    }
  }
}

export {}