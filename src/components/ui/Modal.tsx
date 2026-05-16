'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={cn(
              'relative z-10 flex max-h-[90vh] w-full flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-2xl',
              sizes[size],
              className
            )}
          >
            {/* Sticky header */}
            {title && (
              <div className="flex shrink-0 items-center justify-between border-b border-[rgb(var(--border))] px-6 py-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-[rgb(var(--border))] hover:text-[rgb(var(--foreground))]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-[rgb(var(--border))]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {/* Scrollable body */}
            <div className="overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
