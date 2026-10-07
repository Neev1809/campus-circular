import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

export function MatchScore({ score, explanation, size = 120, strokeWidth = 6, className, delay = 0 }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    if (shouldReduceMotion) {
      const timeout = setTimeout(() => {
        setDisplayScore(score)
      }, delay)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      const duration = 1200
      const startTime = performance.now()

      function animate(currentTime) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayScore(Math.round(eased * score))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isVisible, score, shouldReduceMotion, delay])

  return (
    <div ref={ref} className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            style={{ stroke: 'var(--border-subtle)' }}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            style={{ stroke: scoreColor }}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isVisible ? { strokeDashoffset } : { strokeDashoffset: circumference }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.2, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display font-semibold tabular-nums"
            style={{ fontSize: size * 0.28, color: scoreColor }}
          >
            {displayScore}
          </span>
        </div>
      </div>

      {explanation && (
        <motion.p
          className="text-xs text-text-secondary text-center max-w-[200px] leading-relaxed"
          initial={{ opacity: 0, y: 4 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, delay: (delay / 1000) + 0.8 }}
        >
          {explanation}
        </motion.p>
      )}
    </div>
  )
}

MatchScore.displayName = 'MatchScore'
