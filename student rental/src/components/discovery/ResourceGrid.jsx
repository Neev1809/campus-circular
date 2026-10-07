import { useState, useEffect } from 'react'
import { ResourceCard } from '@/components/shared/ResourceCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { useResourceStore } from '@/store/resourceStore'
import { Loader2 } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'bestMatch',  label: 'Best Match' },
  { value: 'cheapest',   label: 'Price: Low → High' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'closest',    label: 'Nearest' },
]

export function ResourceGrid() {
  const { resources, categories, loading, filters, fetchResources, fetchCategories, setCategory, setSort } = useResourceStore()
  const [localCategory, setLocalCategory] = useState('all')
  const [localSort, setLocalSort] = useState('bestMatch')

  // Fetch categories once
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch resources whenever filter/sort changes
  useEffect(() => {
    fetchResources()
  }, [filters])

  const allCats = ['all', ...categories]

  const handleCategory = (cat) => {
    setLocalCategory(cat)
    setCategory(cat)
  }

  const handleSort = (sort) => {
    setLocalSort(sort)
    setSort(sort)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '6px', borderRadius: '12px' }}>
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={localCategory === cat ? 'glass-strong' : ''}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '13px',
                fontWeight: localCategory === cat ? 600 : 400, textTransform: 'capitalize',
                color: localCategory === cat ? 'white' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', border: 'none', background: 'transparent',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={localSort}
          onChange={(e) => handleSort(e.target.value)}
          className="glass"
          style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: 'white', cursor: 'pointer', outline: 'none' }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ color: 'black' }}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#4B9EE5' }} />
        </div>
      ) : resources.length === 0 ? (
        <EmptyState title="No resources found" description="Try selecting a different category." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  )
}

ResourceGrid.displayName = 'ResourceGrid'
