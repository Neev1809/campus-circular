import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'
import { users } from '@/data/users'

export const DEMO_CREDENTIALS = {
  student: {
    email: 'arjun.mehta@campus.edu',
    password: 'password123',
    label: 'Student (Arjun Mehta)',
    role: 'student',
    user: {
      ...users[0],
      role: 'STUDENT',
    }
  },
  admin: {
    email: 'admin@campus.edu',
    password: 'admin123',
    label: 'System Admin',
    role: 'admin',
    user: {
      id: 'admin1',
      name: 'System Admin',
      email: 'admin@campus.edu',
      role: 'ADMIN',
      department: 'Platform Administration',
      year: null,
      verified: true,
      trustScore: 100,
      onTimeReturnRate: 100,
      successfulExchanges: 50,
      conditionAccuracy: 100,
      responseRate: 100,
      unresolvedDisputes: 0,
      badges: ['Platform Admin', 'Superuser'],
      phone: '+91 99999 88888',
      createdAt: '2024-01-01T00:00:00Z',
    }
  }
}

export const useAuthStore = create(persist(
  (set) => ({
    currentUser: null,
    role: null,           // 'student' | 'admin'
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
    isDemoMode: false,

    /**
     * Standard Java Spring Boot backend login
     * Connects to POST /api/auth/login
     */
    login: async (email, password) => {
      set({ loading: true, error: null })
      try {
        const data = await api.post('/auth/login', { email, password })
        localStorage.setItem('cc_token', data.token)
        set({
          token: data.token,
          currentUser: data.user,
          role: data.user.role ? data.user.role.toLowerCase() : 'student',
          isAuthenticated: true,
          isDemoMode: false,
          loading: false,
          error: null,
        })
        return data.user
      } catch (err) {
        set({ loading: false, error: err.message })
        throw err
      }
    },

    /**
     * Demo Login option
     * Simulates a successful authenticated session locally with predefined credentials.
     * Enables access to all frontend screens without requiring the Java backend or PostgreSQL.
     */
    loginDemo: async (demoRole = 'student', userOverride = null) => {
      set({ loading: true, error: null })
      
      // Brief simulated loading delay for realistic UI transition
      await new Promise((resolve) => setTimeout(resolve, 250))

      const demoConfig = demoRole === 'admin' ? DEMO_CREDENTIALS.admin : DEMO_CREDENTIALS.student
      const user = userOverride || demoConfig.user
      const fakeToken = `demo-jwt-simulated-${user.role.toLowerCase()}-${Date.now()}`

      localStorage.setItem('cc_token', fakeToken)

      set({
        token: fakeToken,
        currentUser: user,
        role: user.role.toLowerCase(),
        isAuthenticated: true,
        isDemoMode: true,
        loading: false,
        error: null,
      })

      return user
    },

    /** Register a new student account via Java backend */
    register: async (payload) => {
      set({ loading: true, error: null })
      try {
        const data = await api.post('/auth/register', payload)
        localStorage.setItem('cc_token', data.token)
        set({
          token: data.token,
          currentUser: data.user,
          role: 'student',
          isAuthenticated: true,
          isDemoMode: false,
          loading: false,
          error: null,
        })
        return data.user
      } catch (err) {
        set({ loading: false, error: err.message })
        throw err
      }
    },

    logout: () => {
      localStorage.removeItem('cc_token')
      set({
        currentUser: null,
        role: null,
        isAuthenticated: false,
        token: null,
        isDemoMode: false,
        error: null,
      })
    },

    clearError: () => set({ error: null }),
  }),
  {
    name: 'campus-circular-auth',
    partialize: (state) => ({
      token: state.token,
      currentUser: state.currentUser,
      role: state.role,
      isAuthenticated: state.isAuthenticated,
      isDemoMode: state.isDemoMode,
    }),
  }
))
