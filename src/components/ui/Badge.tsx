import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'orange' | 'muted' | 'success'
  className?: string
}

export default function Badge({ children, variant = 'blue', className }: BadgeProps) {
  const variants = {
    blue: 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20',
    orange: 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    muted:
      'bg-brand-muted/10 text-brand-muted border border-brand-muted/20 dark:bg-white/5 dark:text-[#8F9396]',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
