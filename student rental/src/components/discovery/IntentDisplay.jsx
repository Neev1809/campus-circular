import { motion } from 'framer-motion'
import { Target, Clock, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

export function IntentDisplay({ intent, className }) {
  if (!intent) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('rounded-[4px] border border-border-subtle bg-surface p-4', className)}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <Target size={16} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-accent">We understood:</span>{' '}
            <span className="font-medium text-text-primary">{intent.label}</span>
          </p>
          <p className="text-xs text-text-secondary mt-0.5">{intent.description}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {intent.needs.map((need) => (
              <Badge key={need} variant="success">{need}</Badge>
            ))}
            {intent.duration && (
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <Clock size={12} />
                {intent.duration} day{intent.duration > 1 ? 's' : ''}
              </div>
            )}
            {intent.urgency && (
              <div className="flex items-center gap-1 text-xs text-warning">
                <Zap size={12} />
                {intent.urgency}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

IntentDisplay.displayName = 'IntentDisplay'
