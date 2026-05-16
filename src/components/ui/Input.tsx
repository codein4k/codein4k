import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[rgb(var(--foreground))]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-brand-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'h-10 w-full rounded-xl border bg-[rgb(var(--card))] px-3 text-sm transition-all duration-200',
              'placeholder:text-brand-muted/60',
              'focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/60',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-500/60 focus:ring-red-500/50'
                : 'border-[rgb(var(--border))]',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[rgb(var(--foreground))]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border bg-[rgb(var(--card))] px-3 py-2.5 text-sm transition-all duration-200',
            'placeholder:text-brand-muted/60',
            'focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/60',
            'disabled:opacity-50 disabled:cursor-not-allowed resize-none',
            error
              ? 'border-red-500/60 focus:ring-red-500/50'
              : 'border-[rgb(var(--border))]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Input
