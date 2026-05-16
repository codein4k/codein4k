'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-brand-blue text-white hover:bg-[#0d8fd4] shadow-md hover:shadow-glow-blue',
      secondary:
        'bg-brand-orange text-white hover:bg-[#d4460f] shadow-md hover:shadow-glow-orange',
      outline:
        'border border-brand-blue/60 text-brand-blue hover:bg-brand-blue/10 dark:border-brand-blue/40',
      ghost:
        'text-[rgb(var(--foreground))] hover:bg-brand-blue/10 hover:text-brand-blue',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-7 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          iconPosition === 'left' && icon
        )}
        {children}
        {!loading && iconPosition === 'right' && icon}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
