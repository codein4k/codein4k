'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/admin/ImageUpload'
import { slugify } from '@/lib/utils'
import type { Video } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  thumbnail_url: z.string().url('Must be a valid URL').or(z.literal('')),
  youtube_url: z.string().url('Must be a valid URL').or(z.literal('')),
  github_url: z.string().url('Must be a valid URL').or(z.literal('')),
  tags: z.string(),
  published_at: z.string().min(1, 'Publish date is required'),
})

type FormValues = z.infer<typeof schema>

interface VideoFormProps {
  video?: Video
  onSuccess?: () => void
}

export default function VideoForm({ video, onSuccess }: VideoFormProps) {
  const router = useRouter()
  const isEdit = !!video

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: video?.title ?? '',
      slug: video?.slug ?? '',
      description: video?.description ?? '',
      thumbnail_url: video?.thumbnail_url ?? '',
      youtube_url: video?.youtube_url ?? '',
      github_url: video?.github_url ?? '',
      tags: video?.tags?.join(', ') ?? '',
      published_at: video?.published_at
        ? new Date(video.published_at).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    },
  })

  const title = watch('title')
  const thumbnailUrl = watch('thumbnail_url')

  const onSubmit = async (data: FormValues) => {
    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      thumbnail_url: data.thumbnail_url || null,
      youtube_url: data.youtube_url || null,
      github_url: data.github_url || null,
      tags: data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      published_at: new Date(data.published_at).toISOString(),
    }

    const url = isEdit ? `/api/admin/videos/${video.id}` : '/api/admin/videos'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      return toast.error(err.error || 'Something went wrong')
    }

    toast.success(isEdit ? 'Video updated!' : 'Video created!')
    router.refresh()
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Title *"
        id="title"
        {...register('title')}
        error={errors.title?.message}
        onChange={(e) => {
          setValue('title', e.target.value)
          if (!isEdit) setValue('slug', slugify(e.target.value))
        }}
        placeholder="e.g. Learn Python Generators"
      />

      <Input
        label="Slug *"
        id="slug"
        {...register('slug')}
        error={errors.slug?.message}
        placeholder={slugify(title || 'video-title')}
      />

      <Textarea
        label="Description *"
        id="description"
        rows={4}
        {...register('description')}
        error={errors.description?.message}
        placeholder="Short description of the video..."
      />

      <ImageUpload
        label="Thumbnail"
        value={thumbnailUrl}
        onChange={(url) => setValue('thumbnail_url', url, { shouldValidate: true })}
        error={errors.thumbnail_url?.message}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="YouTube URL"
          id="youtube_url"
          type="url"
          {...register('youtube_url')}
          error={errors.youtube_url?.message}
          placeholder="https://youtube.com/watch?v=..."
        />
        <Input
          label="GitHub URL"
          id="github_url"
          type="url"
          {...register('github_url')}
          error={errors.github_url?.message}
          placeholder="https://github.com/..."
        />
      </div>

      <Input
        label="Tags (comma-separated)"
        id="tags"
        {...register('tags')}
        placeholder="Python, Tutorial, Generators"
      />

      <Input
        label="Publish Date *"
        id="published_at"
        type="date"
        {...register('published_at')}
        error={errors.published_at?.message}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEdit ? 'Save Changes' : 'Create Video'}
        </Button>
      </div>
    </form>
  )
}
