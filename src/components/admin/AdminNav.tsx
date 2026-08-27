'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Video, Clapperboard, Settings, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { href: '/adminin4k/dashboard',            icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/adminin4k/dashboard/videos',     icon: Video,           label: 'Videos'     },
  { href: '/adminin4k/dashboard/production', icon: Clapperboard,    label: 'Production' },
  { href: '/adminin4k/dashboard/settings',   icon: Settings,        label: 'Settings'   },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/adminin4k')
    router.refresh()
  }

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <div className="flex items-center gap-2.5 border-b border-[rgb(var(--border))] px-5 py-4">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold text-gradient-brand">CodeIn4K</p>
            <p className="text-[10px] text-brand-muted">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                pathname === href
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : 'text-brand-muted hover:bg-[rgb(var(--border))]/40 hover:text-[rgb(var(--foreground))]'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[rgb(var(--border))] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-muted transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="flex items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 overflow-hidden rounded-full">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-sm font-bold text-gradient-brand">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-1.5 text-brand-muted border border-[rgb(var(--border))]"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))] md:hidden"
          >
            <nav className="flex flex-col gap-1 p-3">
              {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    pathname === href
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-brand-muted hover:bg-[rgb(var(--border))]/40 hover:text-[rgb(var(--foreground))]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-muted hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
