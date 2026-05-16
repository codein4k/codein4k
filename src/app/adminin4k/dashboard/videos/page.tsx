'use client'

import { useState, useEffect } from 'react'
import { Plus, Video } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import VideoForm from '@/components/admin/VideoForm'
import VideoTable from '@/components/admin/VideoTable'
import { createClient } from '@/lib/supabase/client'
import { VideoCardSkeleton } from '@/components/ui/Skeleton'
import type { Video as VideoType } from '@/types'

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  const fetchVideos = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('published_at', { ascending: false })
    setVideos(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6 text-brand-blue" />
            Videos
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            {videos.length} video{videos.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setCreateOpen(true)}
        >
          New Video
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <VideoTable videos={videos} />
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Video"
        size="lg"
      >
        <VideoForm
          onSuccess={() => {
            setCreateOpen(false)
            fetchVideos()
          }}
        />
      </Modal>
    </div>
  )
}
