import { MapPin, Navigation } from 'lucide-react'
import { cn } from '@/lib/cn'

export function LocationDisplay({ location, isRevealed = false, className }) {
  if (!location) return null

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`

  return (
    <div className={cn('rounded-[4px] border border-border-subtle bg-surface p-4', className)}>
      <div className="flex items-start gap-3">
        <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">
            {isRevealed ? location.label : location.area}
          </p>
          {!isRevealed && (
            <p className="text-[11px] text-text-secondary mt-1">
              Exact location shared after booking confirmation
            </p>
          )}
          {isRevealed && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors duration-150"
            >
              <Navigation size={12} />
              Get Directions
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

LocationDisplay.displayName = 'LocationDisplay'
