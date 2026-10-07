export function GlassPage({ title, subtitle, children }) {
  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', color: 'white', marginBottom: '8px' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>
          {subtitle}
        </p>
      )}
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '24px 0' }} />
      {children}
    </div>
  )
}
