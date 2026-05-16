'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Youtube, Github, Instagram, Twitter, Play, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { SOCIAL_LINKS, SITE_TAGLINE } from '@/lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const SOCIALS = [
  {
    href: SOCIAL_LINKS.youtube,
    icon: Youtube,
    label: 'YouTube',
    color: 'hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5',
  },
  {
    href: SOCIAL_LINKS.github,
    icon: Github,
    label: 'GitHub',
    color: 'hover:text-white hover:border-white/50 hover:bg-white/5',
  },
  {
    href: SOCIAL_LINKS.instagram,
    icon: Instagram,
    label: 'Instagram',
    color: 'hover:text-pink-400 hover:border-pink-400/50 hover:bg-pink-500/5',
  },
  {
    href: SOCIAL_LINKS.twitter,
    icon: Twitter,
    label: 'X / Twitter',
    color: 'hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-500/5',
  },
]

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[rgb(var(--background))]">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-100" />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-28 text-center sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex justify-center"
        >
          <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-2xl glow-blue">
            <Image
              src="/logo.png"
              alt="CodeIn4K"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Pill badge */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 flex justify-center"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-brand-blue">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-blue" />
            Now Publishing Programming Tutorials
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="text-gradient-brand">CodeIn</span>
          <span className="text-[rgb(var(--foreground))]">4K</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-4 text-xl font-medium text-brand-muted sm:text-2xl"
        >
          {SITE_TAGLINE}
        </motion.p>

        {/* Description */}
        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mb-10 max-w-xl text-base text-brand-muted/80 leading-relaxed sm:text-lg"
        >
          Deep-dive programming tutorials, walkthroughs & project builds — crafted
          for developers who want to go beyond the surface.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              size="lg"
              icon={<Play className="h-4 w-4" />}
              className="font-semibold"
            >
              Watch on YouTube
            </Button>
          </Link>
          <Link href="/videos">
            <Button
              variant="outline"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
              className="font-semibold"
            >
              Browse Videos
            </Button>
          </Link>
        </motion.div>

        {/* Social links */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {SOCIALS.map(({ href, icon: Icon, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`flex h-11 items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-4 text-sm font-medium text-brand-muted transition-all duration-200 ${color}`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-brand-muted/30 p-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-brand-blue/60"
          />
        </div>
      </motion.div>
    </section>
  )
}
