'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Youtube } from 'lucide-react'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import { PRODUCTION_STEPS, type ProductionStatus, type ProductionStep } from '@/types'

const schema = z.object({
  video_title: z.string().min(1, 'Title is required'),
  video_description: z.string(),
  thumbnail_url: z.string().url('Must be a valid URL').or(z.literal('')),
  youtube_url: z.string().url('Must be a valid URL').or(z.literal('')),
  current_step: z.enum([
    'research',
    'script_writing',
    'recording',
    'editing',
    'thumbnail_design',
    'publishing',
    'published',
  ]),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface ProductionFormProps {
  production: ProductionStatus | null
  onSuccess?: () => void
}

export default function ProductionForm({ production, onSuccess }: ProductionFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      video_title: production?.video_title ?? '',
      video_description: production?.video_description ?? '',
      thumbnail_url: production?.thumbnail_url ?? '',
      youtube_url: production?.youtube_url ?? '',
      current_step: (production?.current_step as ProductionStep) ?? 'research',
      is_active: production?.is_active ?? true,
    },
  })

  const thumbnailUrl = watch('thumbnail_url')
  const currentStep = watch('current_step')
  const isPublished = currentStep === 'published'

  const onSubmit = async (data: FormValues) => {
    const payload = {
      id: production?.id,
      video_title: data.video_title,
      video_description: data.video_description,
      thumbnail_url: data.thumbnail_url || null,
      youtube_url: data.youtube_url || null,
      current_step: data.current_step,
      is_active: data.is_active,
    }

    const res = await fetch('/api/admin/production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      return toast.error(err.error || 'Something went wrong')
    }

    toast.success('Production status updated!')
    router.refresh()
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Video Title *"
        id="video_title"
        {...register('video_title')}
        error={errors.video_title?.message}
        placeholder="e.g. Building a Full-Stack App with Next.js"
      />

      <Textarea
        label="Short Description"
        id="video_description"
        rows={3}
        {...register('video_description')}
        placeholder="Brief preview of what this video covers..."
      />

      <ImageUpload
        label="Thumbnail"
        value={thumbnailUrl}
        onChange={(url) => setValue('thumbnail_url', url, { shouldValidate: true })}
        error={errors.thumbnail_url?.message}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="current_step" className="text-sm font-medium">
          Current Production Step *
        </label>
        <select
          id="current_step"
          {...register('current_step')}
          className="h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
        >
          {PRODUCTION_STEPS.map((step) => (
            <option key={step.key} value={step.key}>
              {step.step}. {step.label}
            </option>
          ))}
        </select>
      </div>

      {/* YouTube URL — highlighted when step is Published */}
      <div className={isPublished ? 'rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4' : ''}>
        {isPublished && (
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Youtube className="h-4 w-4" />
            Paste the YouTube URL so viewers can watch the video
          </p>
        )}
        <Input
          label={isPublished ? 'YouTube URL *' : 'YouTube URL'}
          id="youtube_url"
          type="url"
          {...register('youtube_url')}
          error={errors.youtube_url?.message}
          placeholder="https://youtube.com/watch?v=..."
          icon={<Youtube className="h-4 w-4" />}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          {...register('is_active')}
          className="h-4 w-4 rounded border-[rgb(var(--border))] accent-brand-blue"
        />
        <span className="text-sm font-medium">Show this card on the homepage</span>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Save Production Status
        </Button>
      </div>
    </form>
  )
}
