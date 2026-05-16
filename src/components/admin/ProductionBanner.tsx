'use client'

import { forwardRef } from 'react'
import { type ProductionStatus } from '@/types'
import { getProgressPercentage, getStepLabel } from '@/lib/utils'

interface ProductionBannerProps {
  production: ProductionStatus
  logoUrl?: string
}

// Full canvas: 2560×1440 (YouTube channel art)
// Safe-area content card: 1546×423, perfectly centered
const ProductionBanner = forwardRef<HTMLDivElement, ProductionBannerProps>(
  ({ production, logoUrl = '/logo.png' }, ref) => {
    const isPublished = production.current_step === 'published'
    const progress = isPublished ? 100 : getProgressPercentage(production.current_step)
    const stepLabel = getStepLabel(production.current_step)

    const blue = '#13A1E9'
    const orange = '#E95213'
    const green = '#22c55e'
    const accentColor = isPublished ? green : orange
    const bg = '#0D1117'
    const cardBg = '#111820'
    const border = '#30363D'
    const muted = '#8B949E'

    // Safe-area card: 1546×423
    const cw = 1546
    const ch = 423
    // Thumbnail takes ~47% of card width for a strong visual presence
    const thumbW = 720

    return (
      <div
        ref={ref}
        style={{
          width: 2560,
          height: 1440,
          background: bg,
          fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Full-canvas background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(19,161,233,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(19,161,233,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Wide center glow */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 2400,
            height: 900,
            background: `radial-gradient(ellipse at center, ${blue}0C 0%, transparent 60%)`,
          }}
        />

        {/* Corner glows */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 700, height: 700, background: `radial-gradient(ellipse at top left, ${blue}09 0%, transparent 70%)` }} />
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: 700, height: 700, background: `radial-gradient(ellipse at bottom right, ${accentColor}09 0%, transparent 70%)` }} />

        {/* ── Safe-area card ── */}
        <div
          style={{
            width: cw,
            height: ch,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 24,
            border: `1.5px solid ${border}`,
            background: cardBg,
            boxShadow: `0 0 160px ${blue}12, 0 8px 80px #00000080`,
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              borderRadius: '24px 24px 0 0',
              background: isPublished
                ? `linear-gradient(90deg, ${green}, ${blue})`
                : `linear-gradient(90deg, ${blue}, ${orange})`,
            }}
          />

          {/* Inner grid overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(19,161,233,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(19,161,233,0.025) 1px, transparent 1px)
              `,
              backgroundSize: '44px 44px',
            }}
          />

          {/* Left glow */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 700,
              height: ch,
              background: `radial-gradient(ellipse at left center, ${blue}14 0%, transparent 70%)`,
            }}
          />

          {/* Right glow */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 450,
              height: 300,
              background: `radial-gradient(ellipse at right bottom, ${accentColor}12 0%, transparent 70%)`,
            }}
          />

          {/* ── LEFT: Thumbnail ── */}
          <div
            style={{
              width: thumbW,
              height: ch,
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '22px 0 0 22px',
            }}
          >
            {production.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={production.thumbnail_url}
                alt={production.video_title}
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${blue}30, ${orange}30)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 96,
                }}
              >
                🎬
              </div>
            )}
            {/* Fade into card */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 140,
                height: '100%',
                background: `linear-gradient(to right, transparent, ${cardBg})`,
              }}
            />
          </div>

          {/* ── RIGHT: Content ── */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px 44px 28px 24px',
              position: 'relative',
            }}
          >
            {/* Top: branding + status badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="CodeIn4K"
                  crossOrigin="anonymous"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    flexShrink: 0,
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${blue}, ${orange})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                  }}
                >
                  CodeIn4K
                </span>
                <span style={{ color: muted, fontSize: 17, marginLeft: 4 }}>
                  A Powerful Dose of Learning
                </span>
              </div>

              {/* Status badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 20px',
                  borderRadius: 999,
                  border: `1.5px solid ${accentColor}55`,
                  background: `${accentColor}18`,
                  color: accentColor,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: 14 }}>{isPublished ? '✅' : '⚡'}</span>
                {isPublished ? 'Published on YouTube' : 'Currently In Production'}
              </div>
            </div>

            {/* Middle: label + title */}
            <div>
              <p
                style={{
                  color: accentColor,
                  fontSize: 20,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 2.5,
                  margin: '0 0 10px 0',
                }}
              >
                {isPublished ? 'Latest Video' : 'Next Video Coming Soon'}
              </p>
              <h2
                style={{
                  color: '#F0F6FF',
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-1px',
                }}
              >
                {production.video_title}
              </h2>
            </div>

            {/* Bottom: stage + progress bar + percent */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: muted, fontSize: 20 }}>Stage:</span>
                  <span style={{ color: isPublished ? green : blue, fontSize: 26, fontWeight: 800 }}>
                    {stepLabel}
                  </span>
                </div>
                <span style={{ color: isPublished ? green : blue, fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 14,
                  borderRadius: 999,
                  background: border,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: 999,
                    background: isPublished
                      ? green
                      : `linear-gradient(90deg, ${blue}, ${orange})`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ProductionBanner.displayName = 'ProductionBanner'
export default ProductionBanner
