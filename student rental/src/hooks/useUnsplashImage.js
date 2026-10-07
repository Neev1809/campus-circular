import { useState, useEffect } from 'react'
import { searchUnsplashImages } from '@/services/Unsplash'
import { getImageQuery, resourceImageOverrides } from '@/lib/imageQueryMap'

const hookCache = new Map()

export function useUnsplashImage(category, resourceId) {
  const query = getImageQuery(category)
  const [asyncState, setAsyncState] = useState({ loading: Boolean(query) && !hookCache.has(category), error: false })

  useEffect(() => {
    if (resourceId && resourceImageOverrides[resourceId]) return
    if (hookCache.has(category)) return
    if (!query) return

    let cancelled = false

    searchUnsplashImages(query, 1).then((results) => {
      if (cancelled) return

      if (results && results.length > 0) {
        const img = results[0]
        const value = {
          imageUrl: img.urls.small,
          regularUrl: img.urls.regular,
          photographer: img.photographer,
          photographerUrl: img.photographerUrl,
        }
        hookCache.set(category, value)
        setAsyncState({ loading: false, error: false })
      } else {
        setAsyncState({ loading: false, error: true })
      }
    })

    return () => {
      cancelled = true
    }
  }, [category, resourceId, query])

  if (resourceId && resourceImageOverrides[resourceId]) {
    const override = resourceImageOverrides[resourceId]
    return {
      imageUrl: override.small,
      regularUrl: override.regular,
      photographer: override.photographer,
      photographerUrl: override.photographerUrl,
      loading: false,
      error: false,
    }
  }

  const cached = hookCache.get(category)
  if (cached) {
    return { ...cached, loading: false, error: false }
  }

  return {
    imageUrl: null,
    regularUrl: null,
    photographer: null,
    photographerUrl: null,
    loading: asyncState.loading,
    error: asyncState.error,
  }
}
