import { motion } from 'framer-motion'

const pins = [
  { x: 175, y: 148, emoji: '📷', label: 'Canon EOS', price: '₹150/day', color: '#4B9EE5' },
  { x: 305, y: 192, emoji: '💻', label: 'MacBook Pro', price: '₹300/day', color: '#7C6FCD' },
  { x: 118, y: 235, emoji: '📚', label: 'Textbooks', price: '₹50/day', color: '#E5954B' },
  { x: 258, y: 278, emoji: '🎤', label: 'Microphone', price: '₹100/day', color: '#4BE5A0' },
  { x: 368, y: 305, emoji: '⚽', label: 'Sports Kit', price: '₹80/day', color: '#E54B4B' },
]

export function IsometricMap() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox="0 0 480 370"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Ground base */}
        <ellipse cx="240" cy="305" rx="215" ry="55" fill="#E0D4BC" opacity="0.5" />

        {/* Paths between buildings */}
        <path d="M 148 272 L 238 238 L 355 265" stroke="#D0C0A0" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 238 238 L 238 162" stroke="#D0C0A0" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 162 202 L 238 238 L 318 208" stroke="#D0C0A0" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* Trees */}
        {[[88,198],[418,178],[198,318],[348,328],[448,258]].map(([cx,cy],i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx="13" ry="9" fill="#7BAF6B" opacity="0.65" />
            <ellipse cx={cx} cy={cy-7} rx="9" ry="7" fill="#8DC47A" opacity="0.75" />
            <line x1={cx} y1={cy+2} x2={cx} y2={cy+9} stroke="#A08060" strokeWidth="2" />
          </g>
        ))}

        {/* LIBRARY — top left */}
        <g>
          <ellipse cx="148" cy="175" rx="37" ry="10" fill="#C4B49A" opacity="0.25" />
          <path d="M 111 152 L 111 175 L 148 197 L 148 174 Z" fill="#C8B99A" />
          <path d="M 148 174 L 148 197 L 185 175 L 185 152 Z" fill="#B5A688" />
          <path d="M 111 152 L 148 132 L 185 152 L 148 174 Z" fill="#D4917A" />
          <path d="M 111 152 L 148 132 L 148 154 L 111 172 Z" fill="#E4A48A" opacity="0.5" />
          <rect x="119" y="160" width="7" height="7" rx="1" fill="#EED8BC" opacity="0.85" />
          <rect x="153" y="160" width="7" height="7" rx="1" fill="#EED8BC" opacity="0.85" />
          <text x="148" y="207" textAnchor="middle" fill="#8A7A6A" fontSize="7.5" fontFamily="system-ui,sans-serif">Library</text>
        </g>

        {/* ENGINEERING BLOCK — bottom left */}
        <g>
          <ellipse cx="148" cy="265" rx="41" ry="11" fill="#C4B49A" opacity="0.25" />
          <path d="M 107 240 L 107 265 L 148 289 L 148 264 Z" fill="#BEB09A" />
          <path d="M 148 264 L 148 289 L 189 265 L 189 240 Z" fill="#ADA090" />
          <path d="M 107 240 L 148 218 L 189 240 L 148 264 Z" fill="#7A9E8A" />
          <path d="M 107 240 L 148 218 L 148 242 L 107 264 Z" fill="#8AB09A" opacity="0.5" />
          <rect x="117" y="250" width="7" height="7" rx="1" fill="#EED8BC" opacity="0.85" />
          <rect x="152" y="250" width="7" height="7" rx="1" fill="#EED8BC" opacity="0.85" />
          <text x="148" y="299" textAnchor="middle" fill="#8A7A6A" fontSize="7.5" fontFamily="system-ui,sans-serif">Engg Block</text>
        </g>

        {/* AUDITORIUM — top right */}
        <g>
          <ellipse cx="318" cy="175" rx="46" ry="12" fill="#C4B49A" opacity="0.25" />
          <path d="M 272 148 L 272 175 L 318 202 L 318 175 Z" fill="#C8B99A" />
          <path d="M 318 175 L 318 202 L 364 175 L 364 148 Z" fill="#B5A688" />
          <path d="M 272 148 L 318 124 L 364 148 L 318 175 Z" fill="#C4788A" />
          <path d="M 272 148 L 318 124 L 318 148 L 272 172 Z" fill="#D48A9A" opacity="0.45" />
          <rect x="284" y="158" width="7" height="8" rx="1" fill="#EED8BC" opacity="0.85" />
          <rect x="296" y="158" width="7" height="8" rx="1" fill="#EED8BC" opacity="0.85" />
          <rect x="328" y="158" width="7" height="8" rx="1" fill="#EED8BC" opacity="0.85" />
          <text x="318" y="212" textAnchor="middle" fill="#8A7A6A" fontSize="7.5" fontFamily="system-ui,sans-serif">Auditorium</text>
        </g>

        {/* SPORTS BLOCK — bottom right */}
        <g>
          <ellipse cx="328" cy="285" rx="43" ry="11" fill="#C4B49A" opacity="0.25" />
          <path d="M 285 258 L 285 285 L 328 310 L 328 283 Z" fill="#BEB09A" />
          <path d="M 328 283 L 328 310 L 371 285 L 371 258 Z" fill="#ADA090" />
          <path d="M 285 258 L 328 234 L 371 258 L 328 283 Z" fill="#9AAE7A" />
          <path d="M 285 258 L 328 234 L 328 258 L 285 282 Z" fill="#AABE8A" opacity="0.45" />
          <text x="328" y="320" textAnchor="middle" fill="#8A7A6A" fontSize="7.5" fontFamily="system-ui,sans-serif">Sports Block</text>
        </g>

        {/* Central quad */}
        <ellipse cx="238" cy="236" rx="20" ry="13" fill="#B8D4A8" opacity="0.55" />
        <ellipse cx="238" cy="236" rx="12" ry="7" fill="#C8E4B8" opacity="0.65" />

        {/* Animated pin circles */}
        {pins.map((pin, i) => (
          <g key={i}>
            <motion.circle
              cx={pin.x} cy={pin.y} r={14}
              fill="none" stroke={pin.color} strokeWidth="1.5" opacity="0.35"
              animate={{ r: [14, 24, 14], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
            />
            <circle cx={pin.x} cy={pin.y} r="13" fill="white" opacity="0.95" />
            <circle cx={pin.x} cy={pin.y} r="13" fill={pin.color} opacity="0.12" />
            <circle cx={pin.x} cy={pin.y} r="12" fill="none" stroke={pin.color} strokeWidth="1.5" />
            <text x={pin.x} y={pin.y + 5} textAnchor="middle" fontSize="12">{pin.emoji}</text>
          </g>
        ))}
      </svg>

      {/* Floating label cards — positioned relative to SVG percentages */}
      {pins.map((pin, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.12, duration: 0.35 }}
          style={{
            position: 'absolute',
            left: `${(pin.x / 480) * 100}%`,
            top: `${(pin.y / 370) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 18px))',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid #E0D4C0',
            borderRadius: '8px',
            padding: '4px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            whiteSpace: 'nowrap',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#3A3020', margin: 0 }}>{pin.label}</p>
            <p style={{ fontSize: '9px', color: '#8A7A6A', margin: 0, fontFamily: 'monospace' }}>{pin.price}</p>
          </div>
          <div style={{ width: '1px', height: '12px', background: '#C0B09A', margin: '0 auto' }} />
        </motion.div>
      ))}
    </div>
  )
}