import { GlassPage } from '@/components/shared/GlassPage'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react'
import { useExchangeStore } from '@/store/exchangeStore'
import { resources } from '@/data/resources'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const activityData = [
  { name: 'Mon', exchanges: 12 },
  { name: 'Tue', exchanges: 19 },
  { name: 'Wed', exchanges: 15 },
  { name: 'Thu', exchanges: 25 },
  { name: 'Fri', exchanges: 32 },
  { name: 'Sat', exchanges: 40 },
  { name: 'Sun', exchanges: 38 },
]

const categoryData = [
  { name: 'Electronics', value: 45, color: '#4B9EE5' },
  { name: 'Books', value: 25, color: '#F59E0B' },
  { name: 'Tools', value: 20, color: '#4ADE80' },
  { name: 'Misc', value: 10, color: '#A78BFA' },
]

export default function AdminPage() {
  const { exchanges, approveExchange, rejectExchange, getAllUsers } = useExchangeStore()
  const users = typeof getAllUsers === 'function' ? getAllUsers() : []
  
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const pendingRequests = exchanges.filter(ex => ex.status === 'requested')

  const timeAgo = (dateString) => {
    const diff = new Date() - new Date(dateString)
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const handleReject = (id) => {
    rejectExchange(id, rejectReason)
    setRejectingId(null)
    setRejectReason('')
  }

  return (
    <GlassPage title="Admin Command Center" subtitle="Monitor platform activity and resolve disputes.">
      
      {/* PENDING APPROVALS SECTION */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          ⏳ Pending Approvals
          {pendingRequests.length > 0 && (
            <span style={{ background: '#F59E0B', color: '#78350F', fontSize: '14px', padding: '2px 10px', borderRadius: '999px', fontFamily: '"IBM Plex Sans", sans-serif' }}>
              {pendingRequests.length}
            </span>
          )}
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="glass" style={{ padding: '24px', borderRadius: '16px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#4ADE80" /> ✅ No pending requests
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingRequests.map(req => {
              const resource = resources.find(r => r.id === req.resourceId)
              const borrower = users.find(u => u.id === req.borrowerId)
              
              return (
                <div key={req.id} className="glass-strong" style={{ padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                      📦
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{resource?.name}</h4>
                      <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                        Requested by: <strong>{borrower?.name}</strong> · {borrower?.department}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        Requested: {timeAgo(req.requestedAt)}
                      </p>
                    </div>
                  </div>

                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                    Deposit: ₹{req.deposit} | Daily: ₹{req.borrowingCharge}/day
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link to={`/exchange/${req.id}`} style={{ padding: '10px 16px', color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Details <ArrowRight size={14} />
                    </Link>
                    
                    {rejectingId === req.id ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          value={rejectReason} 
                          onChange={e => setRejectReason(e.target.value)} 
                          placeholder="Reason..."
                          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.5)', background: 'rgba(0,0,0,0.3)', color: 'white', width: '150px' }}
                          autoFocus
                        />
                        <button onClick={() => handleReject(req.id)} style={{ padding: '10px', background: '#F87171', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                          Submit
                        </button>
                        <button onClick={() => { setRejectingId(null); setRejectReason(''); }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex' }}>
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => approveExchange(req.id)} style={{ padding: '10px 16px', background: '#4ADE80', color: '#064E3B', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={16} /> Approve
                        </button>
                        <button onClick={() => setRejectingId(req.id)} style={{ padding: '10px 16px', background: 'rgba(248,113,113,0.2)', color: '#F87171', border: '1px solid rgba(248,113,113,0.4)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Total Exchanges', value: exchanges.length.toString() },
          { label: 'Active Users', value: '320' },
          { label: 'Value Saved', value: '₹4.8L' },
          { label: 'Disputes (Active)', value: '0', color: '#4ADE80' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{stat.label}</h3>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', margin: 0, color: stat.color || 'white' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Activity Chart */}
            <div className="glass-strong" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '16px', fontFamily: 'Fraunces, serif', marginBottom: '24px' }}>Platform Activity</h3>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(8,12,24,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#4B9EE5' }}
                    />
                    <Line type="monotone" dataKey="exchanges" stroke="#4B9EE5" strokeWidth={3} dot={{ fill: '#4B9EE5', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Chart */}
            <div className="glass-strong" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '16px', fontFamily: 'Fraunces, serif', marginBottom: '24px' }}>Resource Categories</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                      {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(8,12,24,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categoryData.map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color }} />
                      <span style={{ flex: 1 }}>{c.name}</span>
                      <span style={{ fontWeight: 600 }}>{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Exchanges Table */}
          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontFamily: 'Fraunces, serif', marginBottom: '24px' }}>Recent Exchanges</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'rgba(255,255,255,0.5)' }}>
                  <th style={{ padding: '12px', fontWeight: 500 }}>ID</th>
                  <th style={{ padding: '12px', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '12px', fontWeight: 500 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {exchanges.slice().reverse().slice(0, 5).map(ex => (
                  <tr key={ex.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px' }}>
                      <Link to={`/exchange/${ex.id}`} style={{ color: '#4B9EE5', textDecoration: 'none' }}>{ex.id}</Link>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                        background: (ex.status === 'rated' || ex.status === 'accepted') ? 'rgba(74,222,128,0.2)' : (ex.status === 'rejected' || ex.status === 'cancelled' ? 'rgba(248,113,113,0.2)' : 'rgba(75,158,229,0.2)'),
                        color: (ex.status === 'rated' || ex.status === 'accepted') ? '#4ADE80' : (ex.status === 'rejected' || ex.status === 'cancelled' ? '#F87171' : '#4B9EE5')
                      }}>
                        {ex.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)' }}>
                      {new Date(ex.requestedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Attention Required */}
          <div className="glass-strong" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(248,113,113,0.3)' }}>
            <h3 style={{ fontSize: '16px', fontFamily: 'Fraunces, serif', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171' }}>
              <AlertTriangle size={18} /> Attention Required
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(248,113,113,0.1)', borderRadius: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 4px' }}>Damage Report (ex17)</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px', lineHeight: 1.4 }}>
                  Lender reported scratched lens on return. Security deposit hold active.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, padding: '8px', background: '#F87171', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Review Case</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </GlassPage>
  )
}
