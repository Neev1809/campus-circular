import { Construction, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ComingSoonPage({ title = 'Coming Soon', description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '16px' }}>
      <div className="glass-card" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Construction size={36} color="rgba(255,255,255,0.6)" />
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: 'white', margin: '0 0 12px' }}>{title}</h1>
        <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 24px', lineHeight: 1.5 }}>
          {description || 'This feature is currently under development and will be available soon.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
          <Clock size={12} />
          <span style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>Expected in the next update</span>
        </div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '8px 24px', borderRadius: '999px',
            background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
          }}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}
