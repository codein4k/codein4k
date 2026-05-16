export interface Video {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string | null
  youtube_url: string | null
  github_url: string | null
  tags: string[]
  published_at: string
  created_at: string
  updated_at: string
}

export interface ProductionStatus {
  id: string
  video_title: string
  video_description: string
  thumbnail_url: string | null
  youtube_url: string | null
  current_step: ProductionStep
  is_active: boolean
  updated_at: string
}

export type ProductionStep =
  | 'research'
  | 'script_writing'
  | 'recording'
  | 'editing'
  | 'thumbnail_design'
  | 'publishing'
  | 'published'

export const PRODUCTION_STEPS: {
  key: ProductionStep
  label: string
  step: number
}[] = [
  { key: 'research', label: 'Research', step: 1 },
  { key: 'script_writing', label: 'Script Writing', step: 2 },
  { key: 'recording', label: 'Recording', step: 3 },
  { key: 'editing', label: 'Editing', step: 4 },
  { key: 'thumbnail_design', label: 'Thumbnail Design', step: 5 },
  { key: 'publishing', label: 'Publishing', step: 6 },
  { key: 'published', label: 'Published', step: 7 },
]

export interface VideoFormData {
  title: string
  slug: string
  description: string
  thumbnail_url: string
  youtube_url: string
  github_url: string
  tags: string
  published_at: string
}

export interface ProductionFormData {
  video_title: string
  video_description: string
  thumbnail_url: string
  current_step: ProductionStep
  is_active: boolean
}

export interface AdminSession {
  authenticated: boolean
}
