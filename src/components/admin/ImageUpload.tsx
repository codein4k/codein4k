'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, Link, X, ImageIcon, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  error?: string
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Thumbnail',
  error,
}: ImageUploadProps) {
  const [tab, setTab] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Upload failed')
      } else {
        onChange(data.url)
        toast.success('Image uploaded!')
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-[rgb(var(--foreground))]">
          {label}
        </span>
      )}

      {/* Preview */}
      {value && (
        <div className="relative w-full overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--border))]/20">
          <div className="relative aspect-video w-full">
            <Image
              src={value}
              alt="Thumbnail preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex rounded-xl border border-[rgb(var(--border))] overflow-hidden">
        <button
          type="button"
          onClick={() => setTab('url')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors',
            tab === 'url'
              ? 'bg-brand-blue/10 text-brand-blue'
              : 'text-brand-muted hover:text-[rgb(var(--foreground))]'
          )}
        >
          <Link className="h-3.5 w-3.5" />
          Paste URL
        </button>
        <div className="w-px bg-[rgb(var(--border))]" />
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors',
            tab === 'upload'
              ? 'bg-brand-blue/10 text-brand-blue'
              : 'text-brand-muted hover:text-[rgb(var(--foreground))]'
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload File
        </button>
      </div>

      {/* URL input */}
      {tab === 'url' && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={cn(
            'h-10 w-full rounded-xl border bg-[rgb(var(--card))] px-3 text-sm transition-all',
            'placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/60',
            error ? 'border-red-500/60' : 'border-[rgb(var(--border))]'
          )}
        />
      )}

      {/* File upload area */}
      {tab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all',
            dragOver
              ? 'border-brand-blue bg-brand-blue/5'
              : 'border-[rgb(var(--border))] hover:border-brand-blue/50 hover:bg-brand-blue/5',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
              <p className="text-sm text-brand-muted">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10">
                <ImageIcon className="h-6 w-6 text-brand-blue" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Drop image here or{' '}
                  <span className="text-brand-blue">click to browse</span>
                </p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  JPG, PNG, WEBP, GIF — max 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
