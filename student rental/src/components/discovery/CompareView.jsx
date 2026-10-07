import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { MatchScore } from '@/components/shared/MatchScore'
import { TrustBadge } from '@/components/shared/TrustBadge'
import { computeMatchScores } from '@/lib/matching'

const SORT_TABS = [
  { key: 'match', label: 'Best Match' },
  { key: 'price', label: 'Cheapest' },
  { key: 'distance', label: 'Closest' },
]

export function CompareView({ resources }) {
  const [sortBy, setSortBy] = useState('match')

  const scoredResources = useMemo(() => {
    const results = computeMatchScores(resources, [])
    return results.map(result => ({
      ...result.resource,
      matchResult: {
        overall: result.totalScore,
        explanation: result.explanation,
        factors: [
          { name: 'Distance', score: Math.round(result.scores.distance) },
          { name: 'Trust', score: Math.round(result.scores.trust) },
          { name: 'Condition', score: Math.round(result.scores.condition) },
          { name: 'Price', score: Math.round(result.scores.price) },
          { name: 'Suitability', score: Math.round(result.scores.suitability) }
        ]
      }
    }))
  }, [resources])

  const sorted = useMemo(() => {
    const copy = [...scoredResources]
    switch (sortBy) {
      case 'price':
        return copy.sort((a, b) => a.pricePerDay - b.pricePerDay)
      case 'distance':
        return copy.sort((a, b) => a.distance - b.distance)
      default:
        return copy.sort((a, b) => b.matchResult.overall - a.matchResult.overall)
    }
  }, [scoredResources, sortBy])

  const top3 = sorted.slice(0, 3)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: 'white', margin: 0 }}>Smart Match</h2>
        <div className="glass" style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '8px' }}>
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={sortBy === tab.key ? 'glass-strong' : ''}
              style={{
                padding: '4px 12px', fontSize: '12px', fontWeight: sortBy === tab.key ? 600 : 400,
                borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'transparent',
                color: sortBy === tab.key ? 'white' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className={`glass-card ${index === 0 ? 'glass-strong' : ''}`}
            style={{
              padding: '24px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center',
              borderRadius: '16px', position: 'relative'
            }}
          >
            {index === 0 && (
              <div style={{
                position: 'absolute', top: '-12px', background: '#4ade80',
                color: '#064e3b', padding: '2px 12px', borderRadius: '999px',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Top Pick
              </div>
            )}

            <div style={{ transform: 'scale(0.8)', marginBottom: '-16px' }}>
              <MatchScore
                score={resource.matchResult.overall}
                explanation={resource.matchResult.explanation}
                delay={index * 200}
              />
            </div>

            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: 'white', margin: '16px 0 4px' }}>
              {resource.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} />
                <span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{resource.distance < 1 ? `${Math.round(resource.distance * 1000)}m` : `${resource.distance.toFixed(1)}km`}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} fill="#fbbf24" color="#fbbf24" />
                <span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{resource.rating}</span>
              </span>
            </div>
            
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '20px', fontWeight: 600, color: 'white', margin: '0 0 16px' }}>
              ₹{resource.pricePerDay}<span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: '"IBM Plex Sans", sans-serif' }}>/day</span>
            </p>

            <TrustBadge score={resource.owner.trustScore} verified={resource.owner.verified} size="sm" className="mb-6" />

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {resource.matchResult.factors.map((factor) => (
                <div key={factor.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <span style={{ width: '80px', color: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>{factor.name}</span>
                  <div style={{ flex: 1, height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div
                      style={{ height: '100%', borderRadius: '999px', background: index === 0 ? '#4ade80' : '#4B9EE5', width: `${factor.score}%` }}
                    />
                  </div>
                  <span style={{ width: '32px', fontFamily: '"IBM Plex Mono", monospace', color: 'rgba(255,255,255,0.8)', textAlign: 'right' }}>{factor.score}</span>
                </div>
              ))}
            </div>

            <Link to={`/resource/${resource.id}`} style={{ width: '100%', textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%', padding: '10px', borderRadius: '999px',
                  background: index === 0 ? '#4B9EE5' : 'rgba(255,255,255,0.1)',
                  color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                View Details
                <ArrowRight size={14} />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

CompareView.displayName = 'CompareView'
