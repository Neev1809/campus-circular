import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassPage } from '@/components/shared/GlassPage'
import { requests as mockRequests } from '@/data/requests'
import { useAuthStore } from '@/store/authStore'

export default function RequestsPage() {
  const { currentUser } = useAuthStore()
  const [localRequests, setLocalRequests] = useState(mockRequests)
  const [formData, setFormData] = useState({ item: '', description: '', urgent: false })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.item.trim()) return

    const newReq = {
      id: `req${Date.now()}`,
      user: currentUser?.name || 'Campus Student',
      department: currentUser?.department || 'Engineering',
      item: formData.item,
      description: formData.description,
      date: 'Just now',
      urgent: formData.urgent
    }

    setLocalRequests([newReq, ...localRequests])
    setFormData({ item: '', description: '', urgent: false })
  }

  return (
    <GlassPage title="Community Requests" subtitle="Post what you need, or help out a fellow student.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left: Form */}
        <div className="glass-card" style={{ padding: '32px', borderRadius: '16px', height: 'fit-content' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', marginBottom: '24px' }}>Post a Request</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>What do you need?</label>
              <input 
                type="text" 
                value={formData.item}
                onChange={e => setFormData({ ...formData, item: e.target.value })}
                placeholder="e.g. Scientific Calculator"
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none', fontFamily: '"IBM Plex Sans", sans-serif' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Why do you need it?</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details about your requirement..."
                rows={4}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none', fontFamily: '"IBM Plex Sans", sans-serif', resize: 'none' }}
                required
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.urgent}
                onChange={e => setFormData({ ...formData, urgent: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#4B9EE5' }} 
              />
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>This is urgent</span>
            </label>
            <button type="submit" style={{ marginTop: '8px', padding: '14px', background: '#4B9EE5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: '"IBM Plex Sans", sans-serif' }}>
              Post Request
            </button>
          </form>
        </div>

        {/* Right: Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {localRequests.map((req, i) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={req.id} 
              className="glass" 
              style={{ padding: '24px', borderRadius: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                    {req.user.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{req.user}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{req.department}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{req.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{req.item}</h3>
                {req.urgent && (
                  <span style={{ fontSize: '10px', background: 'rgba(248, 113, 113, 0.2)', color: '#F87171', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Urgent</span>
                )}
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '16px' }}>
                {req.description}
              </p>
              <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                I have this
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </GlassPage>
  )
}
