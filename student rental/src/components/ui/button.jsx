import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-body text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 rounded-[4px] cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-text-primary text-surface hover:bg-text-primary/90',
        primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
        outline: 'border border-border-subtle bg-transparent text-text-primary hover:bg-text-primary/5',
        ghost: 'bg-transparent text-text-primary hover:bg-text-primary/5',
        danger: 'bg-danger text-accent-foreground hover:bg-danger/90',
        trust: 'bg-trust text-accent-foreground hover:bg-trust/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export function Button({ className, variant, size, children, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  )
}

Button.displayName = 'Button'
