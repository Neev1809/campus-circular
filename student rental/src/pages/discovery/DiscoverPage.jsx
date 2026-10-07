import { ResourceGrid } from '@/components/discovery/ResourceGrid'
import { GlassPage } from '@/components/shared/GlassPage'

export default function DiscoverPage() {
  return (
    <GlassPage title="Discover Resources" subtitle="Browse and find items available for borrowing on campus.">
      <ResourceGrid />
    </GlassPage>
  )
}
