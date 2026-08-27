'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Youtube, Github } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import { SOCIAL_LINKS } from '@/lib/constants'
import type { SiteConfig } from '@/lib/site-config'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/videos', label: 'Videos' },
]

interface NavbarProps {
  config?: Pick<SiteConfig, 'site_name' | 'logo_url'>
}

export default function Navbar({ config }: NavbarProps = {}) {
  const siteName = config?.site_name ?? 'CodeIn4K'
  const logoUrl  = config?.logo_url  ?? '/logo.png'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]/90 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-full transition-transform duration-200 group-hover:scale-110">
            <Image
              src={logoUrl}
              alt={`${siteName} Logo`}
              fill
              className="object-contain"
              priority
              unoptimized={logoUrl.startsWith('http')}
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient-brand">
            {siteName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                pathname === link.href
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : 'text-brand-muted hover:bg-[rgb(var(--border))]/50 hover:text-[rgb(var(--foreground))]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-brand-muted transition-all hover:border-red-500/40 hover:text-red-500 hover:bg-red-500/5"
          >
            <Youtube className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-brand-muted transition-all hover:border-[rgb(var(--foreground))]/40 hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--border))]/50"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-brand-muted transition-colors hover:text-[rgb(var(--foreground))]"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-brand-muted hover:bg-[rgb(var(--border))]/50 hover:text-[rgb(var(--foreground))]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-brand-muted border border-[rgb(var(--border))] hover:text-red-500 hover:border-red-500/40 transition-all"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </a>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-brand-muted border border-[rgb(var(--border))] hover:text-[rgb(var(--foreground))] transition-all"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
