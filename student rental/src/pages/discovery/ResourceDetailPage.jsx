import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { ArrowLeft, Star, MapPin, ShieldCheck, Shield, ShoppingCart, ArrowRight, Check } from 'lucide-react'
import { useResourceStore } from '@/store/resourceStore'
import { useExchangeStore } from '@/store/exchangeStore'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useUnsplashImage } from '@/hooks/useUnsplashImage'

const categoryEmoji = {
  camera: '📷', laptop: '💻', tripod: '📐', microphone: '🎙️',
  lighting: '💡', calculator: '🧮', textbook: '📚', projector: '📽️',
  sports: '🏅', tools: '🔧',
}

export default function ResourceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const getResourceById = useResourceStore((s) => s.getResourceById)
  const { createExchange, getActiveExchange } = useExchangeStore()
  const { currentUser, role } = useAuthStore()
  const { addItem, isInCart } = useCartStore()

  const resource = useMemo(() => getResourceById(id), [id, getResourceById])
  const activeExchange = useMemo(() => resource ? getActiveExchange(resource.id) : null, [resource, getActiveExchange])
  const { imageUrl } = useUnsplashImage(resource?.category, resource?.id)

  if (!resource) {
    return (
      <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '16px' }}>Resource not found</h2>
        <Link to="/discover" style={{ color: '#4B9EE5', textDecoration: 'none' }}>← Back to Discover</Link>
      </div>
    )
  }

  const isAdmin = role === 'admin'
  const isRevealed = isAdmin || (activeExchange && activeExchange.status !== 'requested')
  const inCart = isInCart(resource.id)
  const isOwnResource = currentUser && resource.owner.id === currentUser.id

  const handleRequest = () => {
    if (!currentUser) {
      navigate('/auth')
      return
    }

    const exchangeId = createExchange({
      resourceId: resource.id,
      borrowerId: currentUser.id,
      lenderId: resource.owner.id,
      duration: 1,
      borrowingCharge: resource.pricePerDay,
      platformFee: Math.round(resource.pricePerDay * 0.10),
      deposit: resource.deposit,
      totalAmount: resource.pricePerDay + Math.round(resource.pricePerDay * 0.10) + resource.deposit,
    })
    navigate(`/exchange/${exchangeId}`)
  }

  const handleAddToCart = () => {
    if (!inCart && resource.available) {
      addItem(resource)
    }
  }

  return (
    <div style={{ padding: '40px 64px', maxWidth: '1400px', margin: '0 auto', color: 'white' }}>
      <Link
        to="/discover"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px',
          marginBottom: '32px'
        }}
      >
        <ArrowLeft size={16} /> Back to Discover
      </Link>

      {isAdmin && (
        <div className="glass-strong" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(248,113,113,0.3)', marginBottom: '24px', background: 'rgba(248,113,113,0.1)' }}>
          <Shield size={16} color="#F87171" />
          <span style={{ color: '#F87171', fontSize: '14px', fontWeight: 600 }}>Admin View — Full details visible</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
        {/* Left Column (60%) */}
        <div style={{ flex: '6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Image Panel */}
          <div className="glass" style={{
            width: '100%', height: '320px', borderRadius: '16px', overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative',
          }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={resource.name}
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <span style={{ fontSize: '80px' }}>{categoryEmoji[resource.category] || '📦'}</span>
            )}
            
            <div style={{
              position: 'absolute', top: '16px', left: '16px',
              background: resource.available ? 'rgba(46, 172, 109, 0.2)' : 'rgba(235, 87, 87, 0.2)',
              border: `1px solid ${resource.available ? 'rgba(46, 172, 109, 0.4)' : 'rgba(235, 87, 87, 0.4)'}`,
              color: resource.available ? '#4ade80' : '#f87171',
              padding: '6px 12px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 600, backdropFilter: 'blur(8px)',
            }}>
              {resource.available ? 'Available' : 'Unavailable'}
            </div>
            <div style={{
              position: 'absolute', top: '16px', left: resource.available ? '108px' : '124px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', padding: '6px 12px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 600, backdropFilter: 'blur(8px)', textTransform: 'capitalize'
            }}>
              {resource.category}
            </div>
          </div>

          <div className="glass" style={{ padding: '32px', borderRadius: '16px' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', margin: '0 0 16px' }}>{resource.name}</h1>
            
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} color="#FBBF24" /> {resource.rating} Rating</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {resource.distance < 1 ? `${Math.round(resource.distance * 1000)}m` : `${resource.distance.toFixed(1)}km`} away</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Condition: {resource.condition}</span>
            </div>

            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: '0 0 32px' }}>
              {resource.description || 'No description provided.'}
            </p>

            {resource.accessories && resource.accessories.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>Included Accessories</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {resource.accessories.map((acc, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '999px', fontSize: '13px' }}>
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>Borrowing Terms</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px' }}>Daily Rate</div>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '16px' }}>₹{resource.pricePerDay}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px' }}>Security Deposit</div>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '16px' }}>₹{resource.deposit}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px' }}>Condition</div>
                  <div style={{ fontSize: '16px' }}>{resource.condition}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px' }}>Damage Reports</div>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '16px' }}>{resource.history.damageReports}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (40%) */}
        <div style={{ flex: '4', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '100px' }}>
          
          {/* Owner Panel */}
          <div className="glass-strong" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>Owner</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600 }}>
                {resource.owner.name.charAt(0)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>{resource.owner.name.split(' ')[0]}</span>
                  {resource.owner.verified && <ShieldCheck size={16} color="#4ade80" />}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>
                  {resource.owner.department} · Year {resource.owner.year}
                </div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Trust Score</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>⭐ {resource.owner.trustScore}</span>
            </div>

            <Link to={`/trust/${resource.owner.id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4B9EE5', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              View full profile <ArrowRight size={14} />
            </Link>
          </div>

          {/* Contact Details */}
          {isRevealed ? (
            <div className="glass-strong" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(74,222,128,0.3)' }}>
              <h3 style={{ fontSize: '14px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>Contact Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.5)' }}>Name</span><span>{resource.owner.name}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.5)' }}>Phone</span><span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{resource.owner.phone}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.5)' }}>Email</span><span>{resource.owner.email}</span></div>
              </div>
            </div>
          ) : (
            <div className="glass-strong" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                <Shield size={16} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Contact info redacted</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                Full contact details will be revealed once your borrowing request is accepted by the owner.
              </p>
            </div>
          )}

          {/* Pricing Panel */}
          <div className="glass-strong" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>Payment Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Daily Rate</span><span>₹{resource.pricePerDay}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Platform Fee</span><span>₹{Math.round(resource.pricePerDay * 0.1)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Security Deposit</span><span>₹{resource.deposit}</span></div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '16px' }}><span>Total</span><span>₹{resource.pricePerDay + Math.round(resource.pricePerDay * 0.1) + resource.deposit}</span></div>
            </div>
          </div>

          {/* Buttons */}
          {isOwnResource ? (
            <div style={{ background: 'rgba(75,158,229,0.1)', border: '1px solid rgba(75,158,229,0.3)', padding: '16px', borderRadius: '16px', textAlign: 'center', color: '#4B9EE5', fontSize: '14px', fontWeight: 600 }}>
              This is your listing
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleAddToCart}
                disabled={inCart || !resource.available}
                style={{
                  width: '100%', padding: '16px', borderRadius: '999px',
                  background: inCart ? 'rgba(75,158,229,0.1)' : 'transparent', 
                  color: inCart ? '#4B9EE5' : 'white', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '15px', fontWeight: 600, cursor: inCart || !resource.available ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', backdropFilter: 'blur(8px)'
                }}
              >
                {inCart ? <>Added <Check size={18} /></> : <>Add to Kit <ShoppingCart size={18} /></>}
              </button>
              
              <button 
                onClick={handleRequest}
                disabled={!resource.available || !!activeExchange}
                style={{
                  width: '100%', padding: '16px', borderRadius: '999px',
                  background: (resource.available && !activeExchange) ? '#4B9EE5' : 'rgba(255,255,255,0.1)', 
                  color: 'white', border: 'none',
                  fontSize: '15px', fontWeight: 600, 
                  cursor: (resource.available && !activeExchange) ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.2s'
                }}
              >
                {activeExchange ? `Status: ${activeExchange.status.replace('_', ' ')}` : 'Request to Borrow'} 
                {(!activeExchange && resource.available) && <ArrowRight size={18} />}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
