import { create } from 'zustand'
import { api } from '@/services/api'
import { exchanges as fallbackExchanges } from '@/data/exchanges'
import { users as allUsers } from '@/data/users'
import { useAuthStore } from '@/store/authStore'

const EXCHANGE_STATUS_ORDER = [
  'requested',
  'accepted',
  'handover',
  'borrowed',
  'return_due',
  'inspection',
  'settlement',
  'rated',
]

export const useExchangeStore = create((set, get) => ({
  exchanges: fallbackExchanges,
  loading: false,
  error: null,
  statuses: EXCHANGE_STATUS_ORDER,

  // Fallback helper for components expecting users from exchangeStore
  getAllUsers: () => allUsers,

  // Getter for current user
  get currentUser() {
    return useAuthStore.getState().currentUser || allUsers[0]
  },

  setCurrentUser: (user) => {
    // If needed by legacy Navbar
    useAuthStore.setState({ currentUser: user, role: user.role?.toLowerCase() || 'student' })
  },

  /** Fetch all exchanges for current user (orders + requests) */
  fetchExchanges: async () => {
    set({ loading: true })
    try {
      const [orders, requests] = await Promise.all([
        api.get('/exchanges/orders'),
        api.get('/exchanges/requests'),
      ])
      // Merge and deduplicate by id
      const all = [...(orders || []), ...(requests || [])]
      if (all.length > 0) {
        const unique = Array.from(new Map(all.map((ex) => [ex.id, ex])).values())
        set({ exchanges: unique, loading: false })
        return
      }
      set({ exchanges: fallbackExchanges, loading: false })
    } catch {
      // Backend offline or demo mode: keep fallback exchanges
      set({ exchanges: fallbackExchanges, loading: false })
    }
  },

  /** Place orders for all items in cart */
  checkout: async () => {
    try {
      const orders = await api.post('/exchanges/checkout')
      if (Array.isArray(orders)) {
        set({ exchanges: [...get().exchanges, ...orders] })
        return orders
      }
    } catch {
      // Demo mode / offline fallback
    }
    return []
  },

  /** Create a single direct exchange */
  createExchange: async (params) => {
    const authUser = useAuthStore.getState().currentUser || allUsers[0]
    const tempId = `ex-${Date.now()}`
    const localExchange = {
      id: tempId,
      resourceId: params.resourceId,
      resourceName: params.resourceName || 'Borrowed Item',
      borrowerId: params.borrowerId || authUser.id,
      lenderId: params.lenderId,
      duration: params.duration || 1,
      borrowingCharge: params.borrowingCharge || 100,
      platformFee: params.platformFee || 10,
      deposit: params.deposit || 500,
      totalAmount: params.totalAmount || 610,
      status: 'requested',
      requestedAt: new Date().toISOString(),
    }

    try {
      const exchange = await api.post('/exchanges', {
        resourceId: params.resourceId,
        duration: params.duration || 1,
      })
      if (exchange?.id) {
        set({ exchanges: [...get().exchanges, exchange] })
        return exchange.id
      }
    } catch {
      // Offline / demo fallback
    }

    set({ exchanges: [...get().exchanges, localExchange] })
    return tempId
  },

  approveExchange: async (id) => {
    try {
      const updated = await api.patch(`/exchanges/${id}/approve`)
      if (updated) {
        get()._updateOne(updated)
        return
      }
    } catch {
      // Offline fallback
    }
    const current = get().exchanges.find((e) => e.id === id)
    if (current) {
      get()._updateOne({ ...current, status: 'accepted', acceptedAt: new Date().toISOString() })
    }
  },

  rejectExchange: async (id, reason) => {
    try {
      const updated = await api.patch(`/exchanges/${id}/reject`, { reason })
      if (updated) {
        get()._updateOne(updated)
        return
      }
    } catch {
      // Offline fallback
    }
    const current = get().exchanges.find((e) => e.id === id)
    if (current) {
      get()._updateOne({ ...current, status: 'rejected', rejectReason: reason })
    }
  },

  cancelExchange: async (id) => {
    try {
      const updated = await api.patch(`/exchanges/${id}/cancel`)
      if (updated) {
        get()._updateOne(updated)
        return
      }
    } catch {
      // Offline fallback
    }
    const current = get().exchanges.find((e) => e.id === id)
    if (current) {
      get()._updateOne({ ...current, status: 'cancelled' })
    }
  },

  advanceStatus: async (id) => {
    try {
      const updated = await api.patch(`/exchanges/${id}/advance`)
      if (updated) {
        get()._updateOne(updated)
        return updated
      }
    } catch {
      // Offline fallback
    }
    const current = get().exchanges.find((e) => e.id === id)
    if (current) {
      const currentIndex = EXCHANGE_STATUS_ORDER.indexOf(current.status)
      if (currentIndex !== -1 && currentIndex < EXCHANGE_STATUS_ORDER.length - 1) {
        const nextStatus = EXCHANGE_STATUS_ORDER[currentIndex + 1]
        const updated = { ...current, status: nextStatus }
        get()._updateOne(updated)
        return updated
      }
    }
    return current
  },

  updateExchange: async (id, updates) => {
    try {
      const updated = await api.patch(`/exchanges/${id}`, updates)
      if (updated) {
        get()._updateOne(updated)
        return updated
      }
    } catch {
      // Offline fallback
    }
    const current = get().exchanges.find((e) => e.id === id)
    if (current) {
      const updated = { ...current, ...updates }
      get()._updateOne(updated)
      return updated
    }
  },

  getExchangeById: (id) => get().exchanges.find((ex) => ex.id === id),

  getActiveExchange: (resourceId) =>
    get().exchanges.find(
      (e) =>
        (e.resourceId === resourceId || e.resource?.id === resourceId) &&
        !['rated', 'rejected', 'cancelled'].includes(e.status)
    ),

  getExchangesByUser: (userId) =>
    get().exchanges.filter(
      (ex) => ex.borrowerId === userId || ex.lenderId === userId
    ),

  isRevealed: (id) => {
    const ex = get().exchanges.find((ex) => ex.id === id)
    return ex && ex.status !== 'requested'
  },

  // Internal helper — replaces or inserts one exchange
  _updateOne: (updated) => {
    set((state) => ({
      exchanges: state.exchanges.some((ex) => ex.id === updated.id)
        ? state.exchanges.map((ex) => (ex.id === updated.id ? updated : ex))
        : [...state.exchanges, updated],
    }))
  },
}))
