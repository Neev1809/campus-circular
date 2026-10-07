import { Shield, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'

export function TrustBadge({ score, verified, size = 'md', showLabel = true, className }) {
  const sizes = {
    sm: { icon: 14, text: 'text-xs', score: 'text-sm' },
    md: { icon: 18, text: 'text-sm', score: 'text-base' },
    lg: { icon: 24, text: 'text-base', score: 'text-xl' },
  }

  const s = sizes[size] || sizes.md
  const Icon = verified ? ShieldCheck : Shield

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Highly Trusted'
    if (score >= 80) return 'Trusted'
    if (score >= 70) return 'Good Standing'
    return 'New Member'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1.5">
        <Icon size={s.icon} className={verified ? 'text-success' : 'text-text-secondary'} />
        <span className={cn('font-mono font-semibold text-trust', s.score)}>
          {score}
        </span>
      </div>
      {showLabel && (
        <span className={cn('text-text-secondary', s.text)}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  )
}

TrustBadge.displayName = 'TrustBadge'
