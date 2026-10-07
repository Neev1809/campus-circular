import { useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Shield, Clock, Repeat, Eye, AlertTriangle, Award, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { GlassPage } from '@/components/shared/GlassPage'
import { users } from '@/data/users'

function StatCard({ icon: Icon, label, value, suffix = '%', color = 'white' }) {
  return (
    <div className="glass-card" style={{ padding: '16px', textAlign: 'center', borderRadius: '12px' }}>
      <Icon size={20} color={color} style={{ margin: '0 auto 8px' }} />
      <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '24px', fontWeight: 600, margin: '0 0 4px', color }}>
        {value}{suffix}
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{label}</p>
    </div>
  )
}

export default function TrustPassportPage() {
  const { id, userId } = useParams()
  const targetId = id || userId

  const user = useMemo(() => users.find((u) => u.id === targetId), [targetId])

  if (!user) {
    return (
      <div className="container py-8">
        <EmptyState
          title="User not found"
          description="This user profile doesn't exist."
          action={{ label: 'Go Home', onClick: () => window.history.back() }}
        />
      </div>
    )
  }

  const scoreColor = user.trustScore >= 90
    ? '#4ade80'
    : user.trustScore >= 80
      ? '#fbbf24'
      : 'white'

  return (
    <GlassPage title="Trust Passport" subtitle="Verified community reputation and exchange history.">
      <Link
        to="/discover"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="glass-card"
        style={{ padding: '32px', marginBottom: '24px', borderRadius: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600, fontFamily: 'Fraunces, serif' }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: 'white', margin: 0 }}>
                {user.name}
              </h1>
              {user.verified ? (
                <ShieldCheck size={20} color="#4ade80" />
              ) : (
                <Shield size={20} color="rgba(255,255,255,0.4)" />
              )}
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px' }}>
              {user.department} · Year {user.year}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant={user.verified ? 'success' : 'default'} style={{ background: user.verified ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)', color: user.verified ? '#4ade80' : 'white', border: 'none' }}>
                {user.verified ? 'Verified Student' : 'Unverified'}
              </Badge>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Trust Score</p>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '48px', fontWeight: 600, margin: 0, color: scoreColor }}>
            {user.trustScore}
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
            {user.trustScore >= 90
              ? 'Highly trusted member of the community'
              : user.trustScore >= 80
                ? 'Trusted member with good track record'
                : user.trustScore >= 70
                  ? 'Member in good standing'
                  : 'New to the platform'}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}
      >
        <StatCard icon={Clock} label="On-Time Returns" value={user.onTimeReturnRate} color="#4ade80" />
        <StatCard icon={Repeat} label="Exchanges" value={user.successfulExchanges} suffix="" color="white" />
        <StatCard icon={Eye} label="Condition Accuracy" value={user.conditionAccuracy} color="#fbbf24" />
        <StatCard icon={AlertTriangle} label="Response Rate" value={user.responseRate} color="#4ade80" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.1 }}
        className="glass-card"
        style={{ padding: '24px', marginBottom: '24px', borderRadius: '16px' }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 16px' }}>Behaviour Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'On-Time Return Rate', value: user.onTimeReturnRate, explanation: `Returned items on time ${user.onTimeReturnRate}% of the time` },
            { label: 'Condition Accuracy', value: user.conditionAccuracy, explanation: `Item condition matched listing description ${user.conditionAccuracy}% of exchanges` },
            { label: 'Response Rate', value: user.responseRate, explanation: `Responds to borrow requests ${user.responseRate}% of the time` },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</span>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', fontWeight: 500, color: 'white' }}>{stat.value}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '4px' }}>
                <div
                  style={{
                    height: '100%', borderRadius: '999px', transition: 'width 0.5s',
                    background: stat.value >= 90 ? '#4ade80' : stat.value >= 75 ? '#fbbf24' : '#f87171',
                    width: `${stat.value}%`
                  }}
                />
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{stat.explanation}</p>
            </div>
          ))}
          <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Unresolved Disputes</span>
              <span style={{
                fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', fontWeight: 500,
                color: user.unresolvedDisputes > 0 ? '#f87171' : '#4ade80'
              }}>
                {user.unresolvedDisputes}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
              {user.unresolvedDisputes === 0 ? 'No unresolved disputes — clean record' : `${user.unresolvedDisputes} dispute(s) pending resolution`}
            </p>
          </div>
        </div>
      </motion.div>

      {user.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.15 }}
          className="glass-card"
          style={{ padding: '24px', borderRadius: '16px' }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 16px' }}>Earned Badges</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user.badges.map((badge) => (
              <div
                key={badge}
                className="glass"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px' }}
              >
                <Award size={14} color="#fbbf24" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#fbbf24' }}>{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </GlassPage>
  )
}
