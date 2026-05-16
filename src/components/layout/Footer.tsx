import Link from 'next/link'
import Image from 'next/image'
import { Youtube, Github, Instagram, Twitter } from 'lucide-react'
import { SOCIAL_LINKS, SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

const SOCIAL_ITEMS = [
  {
    href: SOCIAL_LINKS.youtube,
    icon: Youtube,
    label: 'YouTube',
    hoverClass: 'hover:text-red-500 hover:border-red-500/40',
  },
  {
    href: SOCIAL_LINKS.github,
    icon: Github,
    label: 'GitHub',
    hoverClass: 'hover:text-white hover:border-white/40',
  },
  {
    href: SOCIAL_LINKS.instagram,
    icon: Instagram,
    label: 'Instagram',
    hoverClass: 'hover:text-pink-400 hover:border-pink-400/40',
  },
  {
    href: SOCIAL_LINKS.twitter,
    icon: Twitter,
    label: 'X / Twitter',
    hoverClass: 'hover:text-sky-400 hover:border-sky-400/40',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--background))]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="relative h-9 w-9 overflow-hidden rounded-full">
                <Image
                  src="/logo.png"
                  alt="CodeIn4K Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold">
                <span className="text-gradient-brand">CodeIn</span>
                <span>4K</span>
              </span>
            </Link>
            <p className="text-sm text-brand-muted leading-relaxed max-w-xs">
              {SITE_TAGLINE}. High-quality programming tutorials to level up your
              coding skills.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
              Navigate
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/videos', label: 'Videos' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-muted transition-colors hover:text-brand-blue"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
              Connect
            </h3>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_ITEMS.map(({ href, icon: Icon, label, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] text-brand-muted transition-all duration-200 ${hoverClass}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[rgb(var(--border))] pt-6 sm:flex-row">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-brand-muted">
            Built with{' '}
            <span className="text-gradient-brand font-medium">Next.js & Supabase</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
