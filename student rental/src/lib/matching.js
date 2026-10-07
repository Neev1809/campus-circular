function normalizeTo100(value, min, max) {
  if (max === min) return 50
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
}

function computeSuitability(resource, needs) {
  if (!needs || needs.length === 0) return 50
  return needs.includes(resource.category) ? 100 : 10
}

function computeAvailability(resource) {
  return resource.available ? 100 : 0
}

function computeDistance(resource, maxDistance) {
  return normalizeTo100(maxDistance - resource.distance, 0, maxDistance)
}

function computeTrust(resource) {
  return resource.owner.trustScore || 50
}

function computeCondition(resource) {
  const conditionMap = {
    'Excellent': 100,
    'Good': 75,
    'Fair': 50,
    'Poor': 25,
  }
  return conditionMap[resource.condition] || 50
}

function computePrice(resource, maxPrice) {
  return normalizeTo100(maxPrice - resource.pricePerDay, 0, maxPrice)
}

function generateExplanation(resource) {
  const parts = []

  if (resource.available) {
    parts.push('Available now')
  } else {
    parts.push('Currently unavailable')
  }

  if (resource.distance <= 0.3) {
    parts.push(`only ${Math.round(resource.distance * 1000)}m away`)
  } else if (resource.distance <= 0.6) {
    parts.push(`${Math.round(resource.distance * 1000)}m away`)
  } else {
    parts.push(`${resource.distance.toFixed(1)}km away`)
  }

  if (resource.owner.trustScore >= 90) {
    parts.push('owned by a highly trusted student')
  } else if (resource.owner.trustScore >= 80) {
    parts.push('owned by a trusted student')
  }

  if (resource.condition === 'Excellent') {
    parts.push('in excellent condition')
  }

  return parts.join(', ')
}

export function computeMatchScores(resources, needs) {
  if (!resources || resources.length === 0) return []

  const maxDistance = Math.max(...resources.map((r) => r.distance), 1)
  const maxPrice = Math.max(...resources.map((r) => r.pricePerDay), 1)

  return resources.map((resource) => {
    const scores = {
      suitability: computeSuitability(resource, needs),
      availability: computeAvailability(resource),
      distance: computeDistance(resource, maxDistance),
      trust: computeTrust(resource),
      condition: computeCondition(resource),
      price: computePrice(resource, maxPrice),
    }

    const totalScore = Math.round(
      scores.suitability * 0.30 +
      scores.availability * 0.20 +
      scores.distance * 0.15 +
      scores.trust * 0.15 +
      scores.condition * 0.10 +
      scores.price * 0.10
    )

    return {
      resource,
      scores,
      totalScore,
      explanation: generateExplanation(resource),
    }
  }).sort((a, b) => b.totalScore - a.totalScore)
}

export function sortByCheapest(matchResults) {
  return [...matchResults].sort((a, b) => a.resource.pricePerDay - b.resource.pricePerDay)
}

export function sortByClosest(matchResults) {
  return [...matchResults].sort((a, b) => a.resource.distance - b.resource.distance)
}
