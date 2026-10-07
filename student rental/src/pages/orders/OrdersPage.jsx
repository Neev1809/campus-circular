import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useExchangeStore } from '@/store/exchangeStore'
import { InnerLayout } from '@/components/shared/InnerLayout'
import { GlassPage } from '@/components/shared/GlassPage'
import { useUnsplashImage } from '@/hooks/useUnsplashImage'
import { Loader2 } from 'lucide-react'

const STATUS_BADGES = {
  requested:  { label: '⏳ Pending',    color: '#FBBF24', bg: 'rgba(245,158,11,0.2)'  },
  accepted:   { label: '✅ Accepted',   color: '#4ADE80', bg: 'rgba(74,222,128,0.2)'  },
  handover:   { label: '🤝 Handover',  color: '#4B9EE5', bg: 'rgba(75,158,229,0.2)'  },
  borrowed:   { label: '📦 Active',    color: '#4B9EE5', bg: 'rgba(75,158,229,0.2)'  },
  return_due: { label: '📦 Active',    color: '#4B9EE5', bg: 'rgba(75,158,229,0.2)'  },
  inspection: { label: '🔍 Inspection',color: '#FBBF24', bg: 'rgba(245,158,11,0.2)'  },
  settlement: { label: '💰 Settlement',color: '#FBBF24', bg: 'rgba(245,158,11,0.2)'  },
  rated:      { label: '⭐ Completed', color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.1)' },
  rejected:   { label: '❌ Rejected',  color: '#F87171', bg: 'rgba(248,113,113,0.2)' },
  cancelled:  { label: '🚫 Cancelled', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)' },
}

const STEPPER_STAGES = ['requested', 'accepted', 'borrowed', 'settlement', 'rated']

function OrderCard({ exchange }) {
  const navigate = useNavigate()
  const { cancelExchange } = useExchangeStore()
  const { imageUrl } = useUnsplashImage(exchange.resourceCategory, exchange.resourceId)

  const badge = STATUS_BADGES[exchange.status] || STATUS_BADGES.requested

  let currentStepIdx = STEPPER_STAGES.indexOf(exchange.status)
  if (exchange.status === 'handover') currentStepIdx = 1
  if (exchange.status === 'return_due' || exchange.status === 'inspection') currentStepIdx = 2

  const isTerminal = ['rejected', 'cancelled'].includes(exchange.status)

  const handleActionClick = async (e) => {
    e.stopPropagation()
    if (exchange.status === 'requested') {
      await cancelExchange(exchange.id)
    } else {
      navigate(`/exchange/${exchange.id}`)
    }
  }

  return (
    <div
      className="glass-card"
      onClick={() => navigate(`/exchange/${exchange.id}`)}
      style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer', marginBottom: '16px', flexWrap: 'wrap' }}
    >
      {/* Left: Resource Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '250px', flexShrink: 0 }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imageUrl ? <img src={imageUrl} alt={exchange.resourceName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600 }}>{exchange.resourceName}</h4>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{exchange.resourceCategory}</span>
        </div>
      </div>

      {/* Center: Mini Stepper */}
      <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
        {!isTerminal ? (
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: '4px', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '4px', left: '0', height: '2px', background: '#4B9EE5', zIndex: 1, width: `${(currentStepIdx / (STEPPER_STAGES.length - 1)) * 100}%` }} />
            {STEPPER_STAGES.map((s, i) => {
              const isCompleted = i <= currentStepIdx
              const isCurrent = i === currentStepIdx
              return (
                <div key={s} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isCompleted ? '#4B9EE5' : 'rgba(255,255,255,0.2)' }} />
                  {isCurrent && <span style={{ fontSize: '10px', color: '#4B9EE5', position: 'absolute', top: '16px', fontWeight: 600, textTransform: 'uppercase' }}>{s}</span>}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>
            Request was {exchange.status}
          </div>
        )}
      </div>

      {/* Right: Status & Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '220px', justifyContent: 'flex-end', flexShrink: 0 }}>
        <span style={{ background: badge.bg, color: badge.color, padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
          {badge.label}
        </span>
        <button onClick={handleActionClick}
          style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            border: exchange.status === 'requested' ? '1px solid rgba(248,113,113,0.5)' : 'none',
            background: exchange.status === 'requested' ? 'rgba(248,113,113,0.1)' :
                        ['accepted','handover','borrowed','inspection'].includes(exchange.status) ? '#4B9EE5' : 'rgba(255,255,255,0.1)',
            color: exchange.status === 'requested' ? '#F87171' : 'white',
          }}
        >
          {exchange.status === 'requested' ? 'Cancel' :
           (exchange.status === 'accepted' || exchange.status === 'handover') ? 'Confirm Handover' :
           exchange.status === 'borrowed' ? 'Mark Returned' :
           exchange.status === 'inspection' ? 'Submit Inspection' : 'View Details'}
        </button>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const { currentUser } = useAuthStore()
  const { exchanges, fetchExchanges, loading } = useExchangeStore()
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchExchanges()
  }, [])

  if (!currentUser) return null

  const myOrders = exchanges
    .filter(ex => ex.borrowerId === currentUser.id)
    .slice()
    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))

  const filteredOrders = myOrders.filter(ex => {
    if (filter === 'All') return true
    if (filter === 'Active') return !['rated', 'rejected', 'cancelled'].includes(ex.status)
    if (filter === 'Completed') return ex.status === 'rated'
    if (filter === 'Cancelled') return ['rejected', 'cancelled'].includes(ex.status)
    return true
  })

  return (
    <GlassPage title="My Orders" subtitle="Track your active and past borrowing requests">

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {['All', 'Active', 'Completed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="glass"
            style={{
              padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', border: 'none',
              background: filter === f ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: filter === f ? 'white' : 'rgba(255,255,255,0.6)',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#4B9EE5' }} />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No orders found</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>You don't have any {filter.toLowerCase()} orders.</p>
          <Link to="/discover" style={{ display: 'inline-block', padding: '12px 24px', background: '#4B9EE5', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>
            Browse resources →
          </Link>
        </div>
      ) : (
        <div>
          {filteredOrders.map(ex => <OrderCard key={ex.id} exchange={ex} />)}
        </div>
      )}

    </GlassPage>
  )
}
