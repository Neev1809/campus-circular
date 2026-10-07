import { useMemo } from 'react'
import { CompareView } from '@/components/discovery/CompareView'
import { EmptyState } from '@/components/shared/EmptyState'
import { useResourceStore } from '@/store/resourceStore'
import { BarChart3 } from 'lucide-react'
import { GlassPage } from '@/components/shared/GlassPage'

export default function ComparePage() {
  const resources = useResourceStore((s) => s.resources)

  const availableResources = useMemo(() => {
    return resources.filter((r) => r.available)
  }, [resources])

  if (availableResources.length === 0) {
    return (
      <GlassPage title="Smart Match" subtitle="Compare resources side-by-side with our multi-factor scoring algorithm.">
        <EmptyState
          icon={BarChart3}
          title="No resources to compare"
          description="There are no available resources to compare right now."
        />
      </GlassPage>
    )
  }

  return (
    <GlassPage title="Smart Match" subtitle="Compare resources side-by-side with our multi-factor scoring algorithm.">
      <CompareView resources={availableResources} />
    </GlassPage>
  )
}
