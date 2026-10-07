import { createBrowserRouter, Outlet } from 'react-router-dom'
import HomePage from '@/pages/discovery/HomePage'
import DiscoverPage from '@/pages/discovery/DiscoverPage'
import ResourceDetailPage from '@/pages/discovery/ResourceDetailPage'
import ComparePage from '@/pages/discovery/ComparePage'
import ExchangePage from '@/pages/trust/ExchangePage'
import TrustPassportPage from '@/pages/trust/TrustPassportPage'
import RequestsPage from '@/pages/requests/RequestsPage'
import AdminPage from '@/pages/admin/AdminPage'
import OrdersPage from '@/pages/orders/OrdersPage'
import WishlistPage from '@/pages/wishlist/WishlistPage'
import { InnerLayout } from '@/components/shared/InnerLayout'
import { AuthPage } from '@/pages/auth/AuthPage'
import { AuthGuard } from '@/components/shared/AuthGuard'
import { AppRoot } from '@/components/shared/AppRoot'

export const router = createBrowserRouter([
  {
    element: <AppRoot />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/auth', element: <AuthPage /> },
      {
        element: <InnerLayout><Outlet /></InnerLayout>,
        children: [
          { path: '/discover', element: <AuthGuard><DiscoverPage /></AuthGuard> },
          { path: '/resource/:id', element: <AuthGuard><ResourceDetailPage /></AuthGuard> },
          { path: '/compare', element: <AuthGuard><ComparePage /></AuthGuard> },
          { path: '/exchange/:id', element: <AuthGuard><ExchangePage /></AuthGuard> },
          { path: '/trust/:id', element: <AuthGuard><TrustPassportPage /></AuthGuard> },
          { path: '/requests', element: <AuthGuard><RequestsPage /></AuthGuard> },
          { path: '/orders', element: <AuthGuard><OrdersPage /></AuthGuard> },
          { path: '/wishlist', element: <AuthGuard><WishlistPage /></AuthGuard> },
          { path: '/admin', element: <AuthGuard adminOnly><AdminPage /></AuthGuard> },
        ]
      }
    ]
  }
])
