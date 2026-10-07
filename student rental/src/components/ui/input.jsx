import { cn } from '@/lib/cn'

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-[4px] border border-border-subtle bg-surface px-3 py-2 text-sm font-body text-text-primary placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150',
        className
      )}
      {...props}
    />
  )
}

Input.displayName = 'Input'
