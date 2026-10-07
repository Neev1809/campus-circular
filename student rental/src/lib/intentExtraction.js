const intentMap = [
  {
    purpose: 'video',
    keywords: ['shoot', 'reel', 'vlog', 'video', 'film', 'record', 'content', 'youtube', 'instagram', 'cinematic', 'documentary', 'short film', 'music video', 'footage'],
    needs: ['camera', 'tripod', 'microphone', 'lighting'],
    label: 'Video / Reel Shoot',
    description: 'You need gear for video production',
  },
  {
    purpose: 'presentation',
    keywords: ['present', 'ppt', 'seminar', 'pitch', 'presentation', 'demo', 'showcase', 'powerpoint', 'slides', 'talk', 'conference', 'lecture'],
    needs: ['projector', 'laptop'],
    label: 'Presentation / Seminar',
    description: 'You need equipment for a presentation',
  },
  {
    purpose: 'sports',
    keywords: ['match', 'game', 'tournament', 'practice', 'sport', 'cricket', 'badminton', 'football', 'basketball', 'play', 'team', 'fitness', 'workout'],
    needs: ['sports'],
    label: 'Sports Event',
    description: 'You need sports equipment',
  },
  {
    purpose: 'lab',
    keywords: ['lab', 'project', 'circuit', 'experiment', 'build', 'arduino', 'prototype', 'electronics', 'solder', 'measure', 'test', 'hardware', 'iot', 'sensor', 'multimeter'],
    needs: ['tools', 'calculator', 'laptop'],
    label: 'Lab / Project Work',
    description: 'You need tools and equipment for lab or project work',
  },
  {
    purpose: 'exam',
    keywords: ['exam', 'study', 'test', 'midterm', 'final', 'preparation', 'revision', 'semester', 'endsem', 'midsem', 'quiz', 'assignment', 'homework'],
    needs: ['textbook', 'calculator'],
    label: 'Exam Preparation',
    description: 'You need study materials and tools',
  },
]

const durationPatterns = [
  { pattern: /today|tonight|right now|asap|urgent/i, duration: '1 day', urgency: 'today' },
  { pattern: /tomorrow/i, duration: '1 day', urgency: 'tomorrow' },
  { pattern: /this weekend|saturday|sunday/i, duration: '2 days', urgency: 'this weekend' },
  { pattern: /(\d+)\s*day/i, duration: null, urgency: null },
  { pattern: /(\d+)\s*week/i, duration: null, urgency: null },
  { pattern: /(\d+)\s*hour/i, duration: '1 day', urgency: 'today' },
  { pattern: /next week/i, duration: '3 days', urgency: 'next week' },
  { pattern: /few days|couple of days/i, duration: '3 days', urgency: 'this week' },
]

export function extractIntent(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return null
  }

  const normalizedQuery = query.toLowerCase().trim()

  let bestMatch = null
  let bestScore = 0

  for (const intent of intentMap) {
    let score = 0
    const matchedKeywords = []

    for (const keyword of intent.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score += keyword.length
        matchedKeywords.push(keyword)
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = { ...intent, matchedKeywords }
    }
  }

  if (!bestMatch || bestScore === 0) {
    return {
      purpose: 'general',
      label: 'General Search',
      description: 'Searching for resources matching your query',
      needs: [],
      duration: 'flexible',
      urgency: 'flexible',
      query: normalizedQuery,
      confidence: 0.3,
    }
  }

  let duration = 'flexible'
  let urgency = 'flexible'

  for (const dp of durationPatterns) {
    const match = normalizedQuery.match(dp.pattern)
    if (match) {
      if (dp.duration) {
        duration = dp.duration
        urgency = dp.urgency
      } else if (match[1]) {
        const num = parseInt(match[1], 10)
        if (dp.pattern.source.includes('day')) {
          duration = `${num} day${num > 1 ? 's' : ''}`
          urgency = num <= 2 ? 'soon' : 'this week'
        } else if (dp.pattern.source.includes('week')) {
          duration = `${num} week${num > 1 ? 's' : ''}`
          urgency = 'next week'
        }
      }
      break
    }
  }

  const confidence = Math.min(0.95, 0.5 + (bestMatch.matchedKeywords.length * 0.15))

  return {
    purpose: bestMatch.purpose,
    label: bestMatch.label,
    description: bestMatch.description,
    needs: bestMatch.needs,
    duration,
    urgency,
    query: normalizedQuery,
    confidence,
    matchedKeywords: bestMatch.matchedKeywords,
  }
}

export const examplePrompts = [
  { text: 'I need to shoot a reel tomorrow', icon: '🎬' },
  { text: 'Preparing for a seminar presentation next week', icon: '📊' },
  { text: 'Cricket match this weekend, need gear', icon: '🏏' },
  { text: 'Working on an Arduino project for lab', icon: '🔧' },
]
