import { useState, useCallback } from 'react'
import { Toast, ToastType } from '../components/Toast'

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration: duration || 3000,
    }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    showToast('success', title, message)
  }, [showToast])

  const error = useCallback((title: string, message?: string) => {
    showToast('error', title, message, 5000) // Error messages stay longer
  }, [showToast])

  const info = useCallback((title: string, message?: string) => {
    showToast('info', title, message)
  }, [showToast])

  return {
    toasts,
    closeToast,
    success,
    error,
    info,
  }
}
