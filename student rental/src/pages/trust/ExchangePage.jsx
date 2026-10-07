import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertTriangle, Star, User, ShieldCheck } from 'lucide-react'
import { useExchangeStore } from '@/store/exchangeStore'
import { useAuthStore } from '@/store/authStore'
import { resources } from '@/data/resources'
import { GlassPage } from '@/components/shared/GlassPage'

const STATUS_LABELS = {
  requested: 'Requested',
  accepted: 'Accepted',
  handover: 'Handover',
  borrowed: 'Borrowed',
  return_due: 'Return Due',
  inspection: 'Inspection',
  settlement: 'Settlement',
  rated: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled'
}

export default function ExchangePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getExchangeById, advanceStatus, statuses, cancelExchange, approveExchange, rejectExchange, getAllUsers } = useExchangeStore()
  const { role } = useAuthStore()
  
  const exchange = getExchangeById(id)
  const users = getAllUsers()
  
  const [lateDays, setLateDays] = useState(0)
  const [rating, setRating] = useState(0)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)

  // Timer logic for 'borrowed' state
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 hours mock
  useEffect(() => {
    if (exchange?.status === 'borrowed') {
      const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000)
      return () => clearInterval(timer)
    }
  }, [exchange?.status])
  
  if (!exchange) {
    return (
      <GlassPage title="Exchange Not Found">
        <p>The exchange you are looking for does not exist.</p>
      </GlassPage>
    )
  }

  const resource = resources.find(r => r.id === exchange.resourceId)
  const borrower = users.find(u => u.id === exchange.borrowerId)
  const owner = users.find(u => u.id === exchange.lenderId)
  
  const isAdmin = role === 'admin'
  const currentStatusIdx = statuses.indexOf(exchange.status)

  const handleAdvance = () => advanceStatus(exchange.id)

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}h ${m}m ${s}s`
  }

  if (isAdmin) {
    return (
      <GlassPage title="Exchange Details" subtitle={`Admin View: ${exchange.id}`}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div className="glass-strong" style={{ flex: 1, padding: '32px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', margin: 0 }}>Exchange Overview</h2>
              <span style={{ 
                background: exchange.status === 'requested' ? 'rgba(245,158,11,0.2)' : (exchange.status === 'rejected' || exchange.status === 'cancelled' ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.2)'),
                color: exchange.status === 'requested' ? '#FBBF24' : (exchange.status === 'rejected' || exchange.status === 'cancelled' ? '#F87171' : '#4ADE80'),
                padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, border: '1px solid currentColor'
              }}>
                {STATUS_LABELS[exchange.status]}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px' }}>Borrower</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{borrower?.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{borrower?.department}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: '"IBM Plex Mono", monospace' }}>{borrower?.phone}</div>
                  </div>
                </div>
              </div>

              <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px' }}>Owner</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} color="#4ADE80" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{owner?.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{owner?.department}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: '"IBM Plex Mono", monospace' }}>{owner?.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: '20px', borderRadius: '12px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px' }}>Resource Info</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>{resource?.name}</span>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px' }}>₹{exchange.borrowingCharge}/day | Dep: ₹{exchange.deposit}</span>
              </div>
            </div>

            {exchange.status === 'requested' ? (
              <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                {!showRejectInput ? (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      onClick={() => { approveExchange(exchange.id); alert('Request approved — student will be notified'); }}
                      style={{ flex: 1, padding: '16px', background: 'rgba(74,222,128,0.2)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.4)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <CheckCircle2 size={18} /> Approve Request
                    </button>
                    <button 
                      onClick={() => setShowRejectInput(true)}
                      style={{ flex: 1, padding: '16px', background: 'rgba(248,113,113,0.2)', color: '#F87171', border: '1px solid rgba(248,113,113,0.4)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <AlertTriangle size={18} /> Reject Request
                    </button>
                  </div>
                ) : (
                  <div className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 12px', color: 'white' }}>Rejection Reason</h4>
                    <input 
                      type="text" 
                      value={rejectReason} 
                      onChange={e => setRejectReason(e.target.value)} 
                      placeholder="Why are you rejecting this?"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', marginBottom: '16px' }}
                    />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => rejectExchange(exchange.id, rejectReason)} style={{ flex: 1, padding: '12px', background: '#F87171', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Submit Rejection</button>
                      <button onClick={() => setShowRejectInput(false)} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)' }}>
                Action completed. Current status: <strong>{STATUS_LABELS[exchange.status]}</strong>
              </div>
            )}
          </div>
        </div>
      </GlassPage>
    )
  }

  // STUDENT VIEW
  return (
    <GlassPage title="Exchange Tracker" subtitle={`Managing exchange for ${resource?.name}`}>
      
      {/* Stepper (Only show if not rejected/cancelled) */}
      {!['rejected', 'cancelled'].includes(exchange.status) && (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '36px', left: '48px', right: '48px', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '36px', left: '48px', height: '2px', background: '#4B9EE5', zIndex: 1, width: `calc(${Math.min(currentStatusIdx / (7), 1)} * (100% - 96px))` }} />
          
          {['requested', 'accepted', 'handover', 'borrowed', 'return_due', 'inspection', 'settlement', 'rated'].map((s) => {
            const sIdx = statuses.indexOf(s)
            const isCompleted = sIdx < currentStatusIdx
            const isCurrent = sIdx === currentStatusIdx
            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '8px', opacity: (isCompleted || isCurrent) ? 1 : 0.4 }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: isCompleted ? '#4B9EE5' : (isCurrent ? '#F59E0B' : 'rgba(255,255,255,0.1)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(245, 158, 11, 0.2)' : 'none'
                }}>
                  {isCompleted ? <CheckCircle2 size={14} color="white" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                </div>
                <span style={{ fontSize: '11px', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'white' : 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                  {STATUS_LABELS[s]}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
        <div style={{ flex: 1, maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {exchange.status === 'requested' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
              <Clock size={48} color="#FBBF24" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '8px' }}>⏳ Waiting for owner approval</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
                Your request has been sent. The owner will review it shortly.
              </p>
              
              <div className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>{resource?.name}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Total due: ₹{exchange.totalAmount} (incl. ₹{exchange.deposit} deposit)</div>
                </div>
              </div>

              <button 
                onClick={() => { cancelExchange(exchange.id); navigate('/discover'); }}
                style={{ width: '100%', padding: '14px', background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '999px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Cancel Request
              </button>
            </motion.div>
          )}

          {exchange.status === 'accepted' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <CheckCircle2 size={48} color="#4ADE80" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', margin: '0 0 8px' }}>✅ Request Accepted!</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>The owner has accepted your request. Contact details are now available.</p>
              </div>

              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', color: '#4ADE80', textTransform: 'uppercase', margin: '0 0 16px' }}>Contact Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Name</span><span>{owner?.name}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Phone</span><span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{owner?.phone}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Email</span><span>{owner?.email}</span></div>
                </div>
              </div>

              <div className="glass" style={{ padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: '0 0 12px' }}>Pickup Location</h3>
                <p style={{ margin: '0 0 16px', lineHeight: 1.5 }}>{resource?.location?.address || 'Campus Main Gate'}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${resource?.location?.lat || 0},${resource?.location?.lng || 0}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', textDecoration: 'none', fontSize: '13px' }}>
                  Get Directions ↗
                </a>
              </div>

              <button 
                onClick={() => { advanceStatus(exchange.id); advanceStatus(exchange.id); }} // advances handover -> borrowed immediately
                style={{ width: '100%', padding: '16px', background: '#4B9EE5', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}
              >
                Confirm Handover — I have received the item
              </button>
            </motion.div>
          )}

          {exchange.status === 'borrowed' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '8px' }}>Active Borrowing</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>Please return the item before the deadline to avoid late fees.</p>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '16px', marginBottom: '32px', display: 'inline-block' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Return Deadline</div>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '32px', fontWeight: 600, color: '#4B9EE5' }}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="glass" style={{ padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: '0 0 8px' }}>Return Location</h3>
                <p style={{ margin: 0 }}>{resource?.location?.address || 'Campus Main Gate'}</p>
              </div>

              <button onClick={() => advanceStatus(exchange.id)} style={{ width: '100%', padding: '16px', background: '#4B9EE5', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                Mark as Returned
              </button>
            </motion.div>
          )}

          {exchange.status === 'inspection' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>Post-Return Inspection</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', textAlign: 'center' }}>Verify the item condition with the owner.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase' }}>Before</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6 }}>
                    <li>No scratches on lens</li>
                    <li>Battery fully charged</li>
                    <li>Strap intact</li>
                  </ul>
                </div>
                <div className="glass" style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(75,158,229,0.3)' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#4B9EE5', fontSize: '12px', textTransform: 'uppercase' }}>After (Current)</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6 }}>
                    <li>No scratches on lens ✓</li>
                    <li>Battery depleted (ok) ✓</li>
                    <li>Strap intact ✓</li>
                  </ul>
                </div>
              </div>

              <button onClick={handleAdvance} style={{ width: '100%', padding: '16px', background: '#4B9EE5', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                Submit Inspection
              </button>
            </motion.div>
          )}

          {exchange.status === 'settlement' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>Final Settlement</h2>
              
              <div className="glass" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: '0 0 16px' }}>Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Security Deposit paid</span><span>₹{exchange.deposit}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Borrowing Charge</span><span>-₹{exchange.borrowingCharge}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Platform Fee</span><span>-₹{exchange.platformFee}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F87171' }}><span>Late Fees ({lateDays} days)</span><span>-₹{lateDays * exchange.borrowingCharge}</span></div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ADE80', fontWeight: 600, fontSize: '16px' }}>
                    <span>Refund Amount</span>
                    <span>₹{Math.max(0, exchange.deposit - exchange.borrowingCharge - exchange.platformFee - (lateDays * exchange.borrowingCharge))}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                  <span>Simulate Late Return (Days)</span>
                  <span>{lateDays}</span>
                </label>
                <input type="range" min="0" max="5" value={lateDays} onChange={(e) => setLateDays(Number(e.target.value))} style={{ width: '100%', accentColor: '#4B9EE5' }} />
              </div>

              <button onClick={handleAdvance} style={{ width: '100%', padding: '16px', background: '#4B9EE5', color: 'white', border: 'none', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                Confirm Settlement
              </button>
            </motion.div>
          )}

          {exchange.status === 'rated' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', marginBottom: '24px' }}>
                <CheckCircle2 size={40} color="#4ADE80" />
              </div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', marginBottom: '8px' }}>Exchange Completed</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>How was your experience borrowing from {owner?.name}?</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.1s', transform: rating >= star ? 'scale(1.1)' : 'scale(1)' }}>
                    <Star size={36} fill={rating >= star ? '#FBBF24' : 'transparent'} color={rating >= star ? '#FBBF24' : 'rgba(255,255,255,0.2)'} />
                  </button>
                ))}
              </div>

              <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'left', marginBottom: '32px' }}>
                <div style={{ fontSize: '32px' }}>🌍</div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>Circular Impact</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>By borrowing instead of buying, you saved ₹15,000 and prevented 2.5kg of e-waste.</p>
                </div>
              </div>

              <button onClick={() => navigate('/discover')} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                Submit Rating & Finish
              </button>
            </motion.div>
          )}

          {exchange.status === 'rejected' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(248,113,113,0.1)', marginBottom: '24px' }}>
                <AlertTriangle size={32} color="#F87171" />
              </div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '8px' }}>❌ Request Rejected</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>The owner has declined your request.</p>
              {exchange.rejectReason && (
                <div className="glass" style={{ padding: '16px', borderRadius: '8px', color: '#F87171', fontStyle: 'italic', marginBottom: '32px' }}>
                  "{exchange.rejectReason}"
                </div>
              )}
              <button onClick={() => navigate('/discover')} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                Browse other resources
              </button>
            </motion.div>
          )}

          {exchange.status === 'cancelled' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '16px' }}>Request cancelled</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>You have cancelled this borrowing request.</p>
              <button onClick={() => navigate('/discover')} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}>
                Browse resources
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </GlassPage>
  )
}
