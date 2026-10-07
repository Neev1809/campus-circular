import { ResourceCard } from '@/components/shared/ResourceCard'
import { EmptyState } from '@/components/shared/EmptyState'

export function RecommendedKit({ resources, intent }) {
  if (!resources || resources.length === 0) {
    return (
      <EmptyState
        title="No matches found"
        description="Try rephrasing your query or explore all available resources."
      />
    )
  }

  return (
    <div>
      <h2 className="font-display text-xl font-medium text-text-primary mb-1">
        Recommended Kit
      </h2>
      <p className="text-sm text-text-secondary mb-4">
        {resources.length} resource{resources.length !== 1 ? 's' : ''} matched for {intent.label.toLowerCase()}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}

RecommendedKit.displayName = 'RecommendedKit'
