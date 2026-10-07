import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // array of resource objects
      isOpen: false,
      loading: false,

      /** Fetch cart from backend if available */
      fetchCart: async () => {
        try {
          const items = await api.get('/cart')
          if (Array.isArray(items)) {
            set({ items })
          }
        } catch {
          // Keep local cart state in offline or demo mode
        }
      },

      addItem: async (resource) => {
        const exists = get().items.find((i) => i.id === resource.id)
        if (!exists) set({ items: [...get().items, resource] })
        try {
          await api.post(`/cart/${resource.id}`)
        } catch {
          // Graceful silent fallback for demo/offline mode
        }
      },

      removeItem: async (resourceId) => {
        const prev = get().items
        set({ items: prev.filter((i) => i.id !== resourceId) })
        try {
          await api.delete(`/cart/${resourceId}`)
        } catch {
          // Graceful fallback
        }
      },

      clearCart: async () => {
        set({ items: [] })
        try {
          await api.delete('/cart')
        } catch {
          // Graceful fallback
        }
      },

      isInCart: (resourceId) => !!get().items.find((i) => i.id === resourceId),
      totalDeposit: () => get().items.reduce((sum, i) => sum + (i.deposit || 0), 0),
      totalPerDay: () => get().items.reduce((sum, i) => sum + (i.pricePerDay || 0), 0),

      setIsOpen: (isOpen) => set({ isOpen }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: 'campus-circular-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
