import type { Metadata } from 'next'
import { Clapperboard } from 'lucide-react'
import ProductionForm from '@/components/admin/ProductionForm'
import ProductionCard from '@/components/home/ProductionCard'
import SnapshotButton from '@/components/admin/SnapshotButton'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Production Status' }
export const dynamic = 'force-dynamic'

export default async function ProductionPage() {
  const supabase = await createClient()
  const { data: production } = await supabase
    .from('production_status')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clapperboard className="h-6 w-6 text-brand-orange" />
          Production Status
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          Update the &ldquo;Currently In Production&rdquo; card shown on the homepage.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Edit Production Card
          </h2>
          <ProductionForm production={production} />
        </div>

        {/* Live Preview */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
              Live Preview
            </p>
            {production && <SnapshotButton production={production} />}
          </div>
          {production ? (
            <ProductionCard production={production} />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--border))] text-brand-muted text-sm">
              No production card set yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
