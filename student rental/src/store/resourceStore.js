import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'
import { resources as fallbackResources } from '@/data/resources'

const extractCategories = (list) => {
  const set = new Set(list.map((r) => r.category).filter(Boolean))
  return Array.from(set)
}

const filterAndSortLocally = (list, { search, category, sort }) => {
  let result = [...list]

  if (category && category !== 'all') {
    result = result.filter(
      (r) => r.category && r.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim()
    result = result.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q))
    )
  }

  if (sort === 'cheapest') {
    result.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0))
  } else if (sort === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  } else if (sort === 'closest') {
    result.sort((a, b) => (a.distance || 0) - (b.distance || 0))
  }

  return result
}

export const useResourceStore = create(
  persist(
    (set, get) => ({
      resources: fallbackResources,
      categories: extractCategories(fallbackResources),
      loading: false,
      filters: {
        search: '',
        category: 'all',
        sort: 'bestMatch',
      },

      fetchResources: async () => {
        set({ loading: true })
        try {
          const { search, category, sort } = get().filters
          const params = new URLSearchParams()
          if (search) params.set('search', search)
          if (category && category !== 'all') params.set('category', category)
          if (sort) params.set('sort', sort)

          const data = await api.get(`/resources?${params.toString()}`)
          if (Array.isArray(data) && data.length > 0) {
            set({ resources: data, loading: false })
            return
          }
          // If backend returned empty list, fall back to filtered mock dataset
          const filtered = filterAndSortLocally(fallbackResources, get().filters)
          set({ resources: filtered, loading: false })
        } catch {
          // Fallback to local dataset when Java backend is offline or during demo mode
          const filtered = filterAndSortLocally(fallbackResources, get().filters)
          set({ resources: filtered, loading: false })
        }
      },

      fetchCategories: async () => {
        try {
          const categories = await api.get('/resources/categories')
          if (Array.isArray(categories) && categories.length > 0) {
            set({ categories })
            return
          }
        } catch {
          // ignore, keep fallback categories
        }
        set({ categories: extractCategories(fallbackResources) })
      },

      setSearch: (search) => {
        set((state) => ({ filters: { ...state.filters, search } }))
        const filtered = filterAndSortLocally(fallbackResources, { ...get().filters, search })
        set({ resources: filtered })
      },

      setCategory: (category) => {
        set((state) => ({ filters: { ...state.filters, category } }))
        const filtered = filterAndSortLocally(fallbackResources, { ...get().filters, category })
        set({ resources: filtered })
      },

      setSort: (sort) => {
        set((state) => ({ filters: { ...state.filters, sort } }))
        const filtered = filterAndSortLocally(fallbackResources, { ...get().filters, sort })
        set({ resources: filtered })
      },

      resetFilters: () => {
        const defaultFilters = { search: '', category: 'all', sort: 'bestMatch' }
        set({
          filters: defaultFilters,
          resources: filterAndSortLocally(fallbackResources, defaultFilters),
        })
      },

      getFilteredResources: () => get().resources,

      getResourceById: (id) =>
        get().resources.find((r) => r.id === id) ||
        fallbackResources.find((r) => r.id === id),
    }),
    {
      name: 'campus-circular-resources',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
)
