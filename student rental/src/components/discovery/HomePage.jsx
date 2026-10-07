import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SearchHero } from '@/components/discovery/SearchHero'
import { IntentDisplay } from '@/components/discovery/IntentDisplay'
import { RecommendedKit } from '@/components/discovery/RecommendedKit'
import { IsometricMap } from '@/components/discovery/IsometricMap'
import { extractIntent } from '@/lib/intentExtraction'
import { resources } from '@/data/resources'

const activities = [
  { user: 'Arjun Mehta', dept: 'Computer Science', item: 'Camera', status: 'Lending', avatar: 'A', color: '#4B9EE5' },
  { user: 'Priya Sharma', dept: 'Mechanical Engg', item: 'Tripod', status: 'Lending', avatar: 'P', color: '#E5954B' },
  { user: 'Rohan Desai', dept: 'Electrical Engg', item: 'Textbooks', status: 'Seeking', avatar: 'R', color: '#7C6FCD' },
  { user: 'Sneha Kulkarni', dept: 'Architecture', item: 'Camera', status: 'Lending', avatar: 'S', color: '#4BE5A0' },
  { user: 'Vikram Singh', dept: 'Physics', item: 'Camera', status: 'Lending', avatar: 'V', color: '#E54B4B' },
  { user: 'Kabir Patel', dept: 'Civil Engg', item: 'Hologram', status: 'Seeking', avatar: 'K', color: '#B54BE5' },
]

export default function HomePage() {
  const [intent, setIntent] = useState(null)

  const matchedResources = useMemo(() => {
    if (!intent || intent.needs.length === 0) {
      if (intent && intent.query) {
        return resources.filter((r) =>
          r.name.toLowerCase().includes(intent.query) ||
          r.category.toLowerCase().includes(intent.query) ||
          r.description?.toLowerCase().includes(intent.query)
        )
      }
      return []
    }
    return resources.filter((r) => intent.needs.includes(r.category))
  }, [intent])

  function handleSearch(query) {
    const result = extractIntent(query)
    setIntent(result)
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col" style={{ background: '#F5EFE0' }}>

      {/* Hero — two column */}
      <section className="flex-1 flex flex-col lg:flex-row items-center gap-0 min-h-[calc(100dvh-56px)] overflow-hidden">

        {/* LEFT — search */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 lg:py-0 max-w-xl lg:max-w-none lg:w-[45%] z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 border border-[#E0D0B8] rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4B9EE5] animate-pulse" />
              <span className="text-xs text-[#8A7A6A] font-medium tracking-wide">AI-Powered Resource Matching</span>
            </div>

            <h1
              className="font-display tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: '#2A2018' }}
            >
              Borrow what you need,{' '}
              <span style={{ color: '#4B9EE5' }}>from your campus.</span>
            </h1>

            <p className="font-body text-base mb-8" style={{ color: '#8A7A6A', maxWidth: '420px' }}>
              Tell us what you're trying to do, and we'll find the perfect kit from students around you.
            </p>

            <SearchHero onSearch={handleSearch} theme="warm" />
          </motion.div>
        </div>

        {/* RIGHT — isometric map + activity panel */}
        <div className="lg:w-[55%] w-full flex flex-col lg:flex-row items-stretch lg:h-screen overflow-hidden">

          {/* Map */}
          <div className="flex-1 relative flex items-center justify-center p-4 lg:p-8"
            style={{ background: 'linear-gradient(135deg, #EDE4D0 0%, #F5EFE0 60%, #E8DCC8 100%)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <IsometricMap />
            </motion.div>
          </div>

          {/* Activity panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-full lg:w-56 bg-white/60 backdrop-blur-sm border-l border-[#E0D0B8] flex flex-col overflow-hidden"
          >
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-[#E0D0B8]">
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#8A7A6A' }}>
                Campus Circular
              </p>
              <p className="text-[10px]" style={{ color: '#A09080' }}>Shared Resource Network</p>
            </div>

            {/* Column headers */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#E0D0B8]">
              <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: '#A09080' }}>Student</p>
              <div className="flex gap-6">
                <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: '#A09080' }}>Items</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: '#A09080' }}>Status</p>
              </div>
            </div>

            {/* Activity rows */}
            <div className="flex-1 overflow-y-auto">
              {activities.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                  className="flex items-center justify-between px-4 py-2.5 border-b border-[#EDE4D8] hover:bg-white/40 transition-colors"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ background: a.color }}
                    >
                      {a.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold truncate" style={{ color: '#2A2018' }}>{a.user}</p>
                      <p className="text-[9px] truncate" style={{ color: '#A09080' }}>{a.dept}</p>
                    </div>
                  </div>

                  {/* Item + status */}
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <p className="text-[10px] font-mono" style={{ color: '#5A4A3A' }}>{a.item}</p>
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: a.status === 'Lending' ? '#D4EDDA' : '#FFF3CD',
                        color: a.status === 'Lending' ? '#2D6A4F' : '#856404',
                      }}
                    >
                      {a.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[#E0D0B8]">
              <button className="w-full text-[10px] font-semibold text-center py-1.5 rounded border border-[#D0C0A8] hover:bg-white/60 transition-colors" style={{ color: '#8A7A6A' }}>
                View Full Network Profile
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <div style={{ background: '#EDE4D0', borderTop: '1px solid #D4C4A8' }}>
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1,284', label: 'Resources Reused' },
            { value: '₹4.8L', label: 'Saved by borrowing' },
            { value: '82%', label: 'On-time returns' },
            { value: '320+', label: 'Students sharing' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl font-semibold" style={{ color: '#2A2018' }}>{stat.value}</p>
              <p className="font-body text-xs mt-1" style={{ color: '#8A7A6A' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Results section */}
      {intent && (
        <div id="results-section" className="px-6 py-10 max-w-6xl mx-auto w-full">
          <IntentDisplay intent={intent} />
          {matchedResources.length > 0 && (
            <RecommendedKit resources={matchedResources} intent={intent} />
          )}
        </div>
      )}
    </div>
  )
}