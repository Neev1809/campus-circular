import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { ChevronDown } from 'lucide-react'

export function Select({ value, onValueChange, options = [], placeholder = 'Select...', className }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-[4px] border border-border-subtle bg-surface px-3 py-2 text-sm font-body text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selectedOption ? 'text-text-primary' : 'text-text-secondary'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={cn('text-text-secondary transition-transform duration-150', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 z-40 mt-1 w-full rounded-[4px] border border-border-subtle bg-surface-raised py-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onValueChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                'flex w-full items-center px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer',
                value === option.value
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-primary hover:bg-text-primary/5'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

Select.displayName = 'Select'
