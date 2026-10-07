import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CircleDot, Shield, ShoppingCart, Sparkles, Code2, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useExchangeStore } from '@/store/exchangeStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { BackendFeatures } from '@/components/shared/BackendFeatures'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, role, isDemoMode, logout } = useAuthStore()
  const { items, toggleCart } = useCartStore()
  const { exchanges } = useExchangeStore()
  const { items: wishlistItems } = useWishlistStore()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showBackendModal, setShowBackendModal] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = () => {
    logout()
    navigate('/auth')
  }

  const navLinks = role === 'admin' ? [
    { to: '/', label: 'Home' },
    { to: '/discover', label: 'Discover' },
    { to: '/orders', label: 'My Orders' },
    { to: '/requests', label: 'Requests' },
  ] : [
    { to: '/', label: 'Home' },
    { to: '/discover', label: 'Discover' },
    { to: '/compare', label: 'Compare' },
    { to: '/orders', label: 'My Orders' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/requests', label: 'Requests' },
  ]

  const activeOrders = exchanges.filter(e => 
    currentUser && (e.borrowerId === currentUser.id || e.borrower?.id === currentUser.id) && 
    !['rated', 'rejected', 'cancelled'].includes(e.status)
  ).length

  return (
    <>
      <aside className="glass-strong" style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '200px',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', flexDirection: 'column', zIndex: 40,
      }}>
        {/* Logo Area */}
        <div style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '8px' }}>
          <CircleDot size={18} color="white" />
          <span style={{ fontFamily: 'Fraunces, serif', color: 'white', fontSize: '15px', fontWeight: 500, letterSpacing: '0.02em' }}>
            Campus Circular
          </span>
        </div>

        {/* Demo Mode Indicator Pill */}
        {isDemoMode && (
          <div style={{ margin: '0 16px 12px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(75, 158, 229, 0.15)', border: '1px solid rgba(75, 158, 229, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B9EE5', fontSize: '11px', fontWeight: 600 }}>
              <Sparkles size={12} /> Demo Session
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
              Simulated Mode
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 24px' }}>
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <Link key={to} to={to} style={{
                fontFamily: '"IBM Plex Sans", sans-serif', fontSize: '14px',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                fontWeight: isActive ? 600 : 400, padding: '6px 0', textDecoration: 'none', transition: 'color 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                {label}
                {to === '/orders' && activeOrders > 0 && (
                  <span style={{ background: '#4B9EE5', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '999px', fontWeight: 600 }}>
                    {activeOrders}
                  </span>
                )}
                {to === '/wishlist' && wishlistItems.length > 0 && (
                  <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '999px', fontWeight: 600 }}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )
          })}
          {role === 'admin' && (
            <Link to="/admin" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: '"IBM Plex Sans", sans-serif', fontSize: '14px',
              color: location.pathname === '/admin' ? '#F87171' : 'rgba(248, 113, 113, 0.7)',
              fontWeight: location.pathname === '/admin' ? 600 : 400, padding: '6px 0', textDecoration: 'none', transition: 'color 0.2s'
            }}>
              <Shield size={14} /> Admin Panel
            </Link>
          )}
        </nav>

        {/* Kit Button */}
        <div style={{ padding: '0 24px', marginTop: '12px' }}>
          <button onClick={toggleCart} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.8)', fontSize: '14px', cursor: 'pointer', padding: '6px 0'
          }}>
            <ShoppingCart size={16} /> Kit
            {items.length > 0 && (
              <span style={{
                background: '#4B9EE5', color: 'white', fontSize: '11px', fontWeight: 600,
                padding: '2px 6px', borderRadius: '999px'
              }}>
                {items.length}
              </span>
            )}
          </button>
        </div>

        {/* Backend Features Explorer Button */}
        <div style={{ padding: '0 24px', marginTop: '12px' }}>
          <button
            onClick={() => setShowBackendModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
              color: '#4B9EE5', fontSize: '12px', cursor: 'pointer', padding: '6px 10px',
              width: '100%', textAlign: 'left', fontWeight: 500
            }}
          >
            <Code2 size={13} /> Backend Work
          </button>
        </div>

        {/* Bottom User Section */}
        {currentUser && (
          <div style={{ marginTop: 'auto', padding: '20px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative' }} ref={menuRef}>
            
            {showUserMenu && (
              <div className="glass-strong" style={{
                position: 'absolute', bottom: '100%', left: '16px', right: '16px', marginBottom: '8px',
                borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: role === 'admin' ? 'rgba(248,113,113,0.2)' : 'rgba(74, 222, 128, 0.2)', color: role === 'admin' ? '#F87171' : '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.department || 'Student'}</div>
                  </div>
                </div>
                <Link to={`/trust/${currentUser.id}`} onClick={() => setShowUserMenu(false)} style={{ color: 'white', fontSize: '13px', textDecoration: 'none', padding: '4px 0' }}>
                  View Profile →
                </Link>
                <Link to="/auth" onClick={() => setShowUserMenu(false)} style={{ color: 'white', fontSize: '13px', textDecoration: 'none', padding: '4px 0' }}>
                  Switch Account →
                </Link>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#F87171', fontSize: '13px', textAlign: 'left', padding: '4px 0', cursor: 'pointer' }}>
                  Sign Out
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, flex: 1, minWidth: 0 }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: role === 'admin' ? 'rgba(248,113,113,0.2)' : 'rgba(74, 222, 128, 0.2)', color: role === 'admin' ? '#F87171' : '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                  <span style={{ fontSize: '13px', color: 'white', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
                  </span>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px', color: 'rgba(255,255,255,0.7)' }}>
                    {role === 'admin' ? 'Admin' : 'Student'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Backend Features Modal */}
      <AnimatePresence>
        {showBackendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '1150px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <BackendFeatures onClose={() => setShowBackendModal(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

Sidebar.displayName = 'Sidebar'
