'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ProductionBanner from './ProductionBanner'
import type { ProductionStatus } from '@/types'

interface SnapshotButtonProps {
  production: ProductionStatus
}

export default function SnapshotButton({ production }: SnapshotButtonProps) {
  const bannerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!bannerRef.current) return
    setLoading(true)
    try {
      const dataUrl = await toPng(bannerRef.current, {
        width: 2560,
        height: 1440,
        pixelRatio: 1,
      })
      const link = document.createElement('a')
      link.download = 'codein4k-banner.png'
      link.href = dataUrl
      link.click()
      toast.success('Banner downloaded!')
    } catch {
      toast.error('Failed to capture banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Off-screen banner — rendered but hidden for html-to-image capture */}
      <div style={{ position: 'fixed', left: -9999, top: -9999, zIndex: -1 }}>
        <ProductionBanner
          ref={bannerRef}
          production={production}
          logoUrl={`${window.location.origin}/logo.png`}
        />
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border border-brand-blue/30 bg-brand-blue/10 px-4 py-2.5 text-sm font-semibold text-brand-blue transition-all hover:bg-brand-blue/20 hover:border-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download YouTube Banner
      </button>
    </>
  )
}
