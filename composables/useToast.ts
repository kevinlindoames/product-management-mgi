// composables/useToast.ts
import { notify } from '@kyvg/vue3-notification'

export const useToast = () => {
  return {
    success: (message: string) => {
      notify({
        type: 'success',
        text: message,
        duration: 3000
      })
    },
    error: (message: string) => {
      notify({
        type: 'error',
        text: message,
        duration: 3000
      })
    },
    info: (message: string) => {
      notify({
        type: 'info',
        text: message,
        duration: 3000
      })
    },
    warning: (message: string) => {
      notify({
        type: 'warn',
        text: message,
        duration: 3000
      })
    }
  }
}