import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import ProductionCard from '@/components/home/ProductionCard'
import LatestVideos from '@/components/home/LatestVideos'
import { createClient } from '@/lib/supabase/server'
import { LATEST_VIDEOS_COUNT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Home',
}

export const revalidate = 60

async function getHomeData() {
  const supabase = await createClient()

  const [videosResult, productionResult] = await Promise.all([
    supabase
      .from('videos')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(LATEST_VIDEOS_COUNT),
    supabase
      .from('production_status')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return {
    videos: videosResult.data ?? [],
    production: productionResult.data ?? null,
  }
}

export default async function HomePage() {
  const { videos, production } = await getHomeData()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductionCard production={production} />
        <LatestVideos videos={videos} />
      </main>
      <Footer />
    </>
  )
}
