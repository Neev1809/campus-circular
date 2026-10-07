import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      fetchWishlist: async () => {
        try {
          const items = await api.get('/wishlist')
          if (Array.isArray(items)) {
            set({ items })
          }
        } catch {
          // Keep local wishlist in offline or demo mode
        }
      },

      toggle: async (resource) => {
        const wasWishlisted = get().isWishlisted(resource.id)
        if (wasWishlisted) {
          set({ items: get().items.filter((i) => i.id !== resource.id) })
        } else {
          set({ items: [...get().items, resource] })
        }

        try {
          await api.post(`/wishlist/${resource.id}/toggle`)
        } catch {
          // Keep optimistic local update
        }
      },

      isWishlisted: (resourceId) => !!get().items.find((i) => i.id === resourceId),
    }),
    {
      name: 'campus-circular-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
