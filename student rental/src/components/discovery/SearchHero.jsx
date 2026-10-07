import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const examplePrompts = [
  { emoji: '', text: 'I need to shoot a reel tomorrow' },
  { emoji: '', text: 'Preparing for a seminar presentation' },
  { emoji: '', text: 'Cricket match this weekend, need gear' },
  { emoji: '', text: 'Working on an Arduino project for lab' },
]

export function SearchHero({ onSearch, theme }) {
  const [query, setQuery] = useState('')
  const isWarm = theme === 'warm'

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  function handlePromptClick(text) {
    setQuery(text)
    onSearch(text)
  }

  const inputWrapStyle = isWarm ? {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid #D4C4A8',
    borderRadius: '999px',
    padding: '6px 6px 6px 18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  } : {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '999px',
    padding: '6px 6px 6px 18px',
  }

  return (
    <div style={{ width: '100%' }}>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        style={inputWrapStyle}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you trying to do?"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: '15px', color: isWarm ? '#2A2018' : 'white',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          style={{
            flexShrink: 0, background: '#4B9EE5', color: 'white',
            border: 'none', borderRadius: '999px', padding: '10px 22px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          Find Kit <ArrowRight size={14} />
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '14px' }}
      >
        <span style={{ fontSize: '13px', color: '#A09080', marginRight: '4px' }}>Try:</span>
        {examplePrompts.map((p) => (
          <button
            key={p.text}
            onClick={() => handlePromptClick(p.text)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid #D4C4A8',
              fontSize: '12px', color: '#6A5A4A', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <span>{p.emoji}</span>
            <span>{p.text}</span>
          </button>
        ))}
      </motion.div>
    </div>
  )
}

SearchHero.displayName = 'SearchHero'