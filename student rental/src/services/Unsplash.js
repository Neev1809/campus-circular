const UNSPLASH_BASE = 'https://api.unsplash.com'
const cache = new Map()
const CACHE_TTL = 30 * 60 * 1000

export async function searchUnsplashImages(query, perPage = 1) {
  if (!query) return null

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  if (!accessKey) return null

  const cacheKey = `${query}__${perPage}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results
  }

  try {
    const url = new URL(`${UNSPLASH_BASE}/search/photos`)
    url.searchParams.set('query', query)
    url.searchParams.set('per_page', String(perPage))
    url.searchParams.set('orientation', 'landscape')

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })

    if (!response.ok) return null

    const data = await response.json()

    if (!data.results || data.results.length === 0) return null

    const results = data.results.map((photo) => ({
      id: photo.id,
      urls: {
        small: photo.urls.small,
        regular: photo.urls.regular,
      },
      alt: photo.alt_description || photo.description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }))

    cache.set(cacheKey, { results, timestamp: Date.now() })

    return results
  } catch {
    return null
  }
}
