import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

export function Dialog({ open, onClose, children, className }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-text-primary/40 transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[4px] border border-border-subtle bg-surface-raised p-6 shadow-lg',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors duration-150 cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogTitle({ children, className }) {
  return (
    <h2 className={cn('font-display text-lg font-medium text-text-primary mb-2', className)}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-text-secondary mb-4', className)}>
      {children}
    </p>
  )
}

Dialog.displayName = 'Dialog'
