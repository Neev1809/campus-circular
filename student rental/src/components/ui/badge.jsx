import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-[4px] px-2 py-0.5 text-xs font-medium font-body transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-text-primary/10 text-text-primary',
        success: 'bg-success/10 text-success',
        danger: 'bg-danger/10 text-danger',
        trust: 'bg-trust/10 text-trust',
        warning: 'bg-warning/10 text-warning',
        outline: 'border border-border-subtle text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Badge({ className, variant, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'
