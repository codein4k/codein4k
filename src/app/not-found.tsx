'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-[rgb(var(--background))] pt-16">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-brand-blue/8 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-8xl font-black text-gradient-brand leading-none mb-2">
              404
            </p>
            <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Page Not Found</h1>
            <p className="mb-10 text-brand-muted text-lg leading-relaxed">
              Looks like this page got lost in the codebase. It might have been
              moved, deleted, or never existed.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Home className="h-4 w-4" />}
                >
                  Go Home
                </Button>
              </Link>
              <Link href="/videos">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Search className="h-4 w-4" />}
                >
                  Browse Videos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
