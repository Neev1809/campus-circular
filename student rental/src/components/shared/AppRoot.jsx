import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { CartDrawer } from '@/components/shared/CartDrawer'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useExchangeStore } from '@/store/exchangeStore'

// A wrapper to inject CartDrawer globally and bootstrap backend data on login
export function AppRoot() {
  const { isAuthenticated } = useAuthStore()
  const { fetchCart } = useCartStore()
  const { fetchWishlist } = useWishlistStore()
  const { fetchExchanges } = useExchangeStore()

  useEffect(() => {
    if (isAuthenticated) {
      // Load server-side state for the logged-in user
      fetchCart()
      fetchWishlist()
      fetchExchanges()
    }
  }, [isAuthenticated])

  return (
    <>
      <Outlet />
      <CartDrawer />
    </>
  )
}
