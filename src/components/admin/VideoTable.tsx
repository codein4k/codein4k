'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Youtube, Github, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import VideoForm from './VideoForm'
import type { Video } from '@/types'
import { formatDate, getYouTubeThumbnail } from '@/lib/utils'

interface VideoTableProps {
  videos: Video[]
}

export default function VideoTable({ videos }: VideoTableProps) {
  const router = useRouter()
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Delete failed')
    } else {
      toast.success('Video deleted')
      router.refresh()
    }
    setDeletingId(null)
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border))]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                <th className="px-4 py-3 text-left font-medium text-brand-muted">
                  Video
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-brand-muted sm:table-cell">
                  Tags
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-brand-muted md:table-cell">
                  Published
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-brand-muted lg:table-cell">
                  Links
                </th>
                <th className="px-4 py-3 text-right font-medium text-brand-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--border))]">
              {videos.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-brand-muted"
                  >
                    No videos yet. Create your first video!
                  </td>
                </tr>
              )}
              {videos.map((video) => {
                const thumb =
                  video.thumbnail_url ||
                  (video.youtube_url
                    ? getYouTubeThumbnail(video.youtube_url)
                    : null)

                return (
                  <tr
                    key={video.id}
                    className="bg-[rgb(var(--background))] hover:bg-[rgb(var(--card))] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg bg-[rgb(var(--border))]">
                          {thumb && (
                            <Image
                              src={thumb}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1 max-w-[180px]">
                            {video.title}
                          </p>
                          <p className="text-xs text-brand-muted">{video.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {video.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="muted">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-brand-muted md:table-cell">
                      {formatDate(video.published_at)}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex gap-2">
                        {video.youtube_url && (
                          <a
                            href={video.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-muted hover:text-red-500 transition-colors"
                          >
                            <Youtube className="h-4 w-4" />
                          </a>
                        )}
                        {video.github_url && (
                          <a
                            href={video.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-muted hover:text-[rgb(var(--foreground))] transition-colors"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={`/videos/${video.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-muted hover:text-brand-blue transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Pencil className="h-3.5 w-3.5" />}
                          onClick={() => setEditingVideo(video)}
                          className="h-8 w-8 p-0"
                          aria-label="Edit"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 className="h-3.5 w-3.5 text-red-400" />}
                          onClick={() => setDeletingId(video.id)}
                          className="h-8 w-8 p-0"
                          aria-label="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        title="Edit Video"
        size="lg"
      >
        {editingVideo && (
          <VideoForm
            video={editingVideo}
            onSuccess={() => setEditingVideo(null)}
          />
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Video"
        size="sm"
      >
        <p className="mb-6 text-sm text-brand-muted">
          Are you sure you want to delete this video? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deletingId && handleDelete(deletingId)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}
