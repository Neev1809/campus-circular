import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export function AuthGuard({ children, adminOnly = false }) {
  const { isAuthenticated, role } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && adminOnly && role !== 'admin') {
      // In a real app we'd use a toast library here, but for this demo 
      // we'll just log it or alert if needed. The redirect handles the protection.
      console.warn("Admin access only")
    }
  }, [isAuthenticated, adminOnly, role])

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/discover" replace />
  }

  return children
}
