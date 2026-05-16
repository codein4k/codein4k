'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        toast.success('Welcome back!')
        router.push('/adminin4k/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--background))] p-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 dark:opacity-100" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-2xl">
          <div className="h-1 w-full bg-gradient-brand" />
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col items-center gap-3 text-center">
              <div className="relative h-14 w-14 overflow-hidden rounded-full glow-blue">
                <Image src="/logo.png" alt="CodeIn4K" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-gradient-brand">Admin</span> Panel
                </h1>
                <p className="text-sm text-brand-muted">CodeIn4K Dashboard</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Input
                  label="Admin Password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error}
                  icon={<Lock className="h-4 w-4" />}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-8 text-brand-muted hover:text-[rgb(var(--foreground))] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
