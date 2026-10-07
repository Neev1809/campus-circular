import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useExchangeStore } from '@/store/exchangeStore'

const categoryEmoji = {
  camera: '📷', laptop: '💻', tripod: '📐', microphone: '🎙️',
  lighting: '💡', calculator: '🧮', textbook: '📚', projector: '📽️',
  sports: '🏏', tools: '🔧',
}

export function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, totalDeposit, totalPerDay } = useCartStore()
  const { currentUser } = useAuthStore()
  const { checkout } = useExchangeStore()
  const navigate = useNavigate()
  const [borrowing, setBorrowing] = useState(false)
  const [borrowError, setBorrowError] = useState('')

  if (!isOpen) return null

  const deposit = totalDeposit()
  const perDay = totalPerDay()
  const platformFee = Math.round(perDay * 0.10)
  const dueToday = deposit + platformFee

  const handleBorrow = async () => {
    if (!currentUser) {
      setIsOpen(false)
      navigate('/auth')
      return
    }

    setBorrowing(true)
    setBorrowError('')
    try {
      // Call backend checkout — places orders for all cart items
      await checkout()
      setIsOpen(false)
      navigate('/orders')
      alert('🎉 Successfully requested your kit! Check My Orders for status.')
    } catch (e) {
      setBorrowError(e.message || 'Failed to place order. Please try again.')
    } finally {
      setBorrowing(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-strong"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '380px',
              zIndex: 101, display: 'flex', flexDirection: 'column', padding: '24px',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif', color: 'white', fontSize: '20px', margin: '0 0 4px' }}>Your Kit</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>{items.length} items ready to borrow</p>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '40px', fontSize: '14px' }}>
                  Your kit is empty.
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="glass" style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '12px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                      {categoryEmoji[item.category] || '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0 4px' }}>✕</button>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'capitalize', margin: '0 0 4px' }}>{item.category}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: '#4B9EE5', fontWeight: 600 }}>₹{item.pricePerDay}/day</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Deposit: ₹{item.deposit}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '24px' }} />

                <div className="glass-strong" style={{ padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
                  {items.length > 1 && <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Creator Kit Summary</h4>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    {[
                      ['Items:', items.length],
                      ['Total per day:', `₹${perDay}`],
                      ['Total deposit:', `₹${deposit} (Refundable)`],
                      ['Platform fee (10%):', `₹${platformFee}`],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)' }}>
                        <span>{label}</span><span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{val}</span>
                      </div>
                    ))}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 600, fontSize: '15px' }}>
                      <span>Due today:</span>
                      <span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>₹{dueToday}</span>
                    </div>
                  </div>
                </div>

                {borrowError && (
                  <div style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#F87171', fontSize: '13px', marginBottom: '12px' }}>
                    {borrowError}
                  </div>
                )}

                <button onClick={handleBorrow} disabled={borrowing}
                  style={{
                    width: '100%', padding: '16px', background: borrowing ? 'rgba(75,158,229,0.5)' : '#4B9EE5',
                    color: 'white', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 600,
                    cursor: borrowing ? 'not-allowed' : 'pointer', marginBottom: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  {borrowing ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Placing Order...</> : 'Borrow Kit'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
                    Continue browsing
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
