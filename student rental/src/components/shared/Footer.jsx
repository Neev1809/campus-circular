export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '32px 24px',
      textAlign: 'center',
      background: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '8px',
      }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          border: '2px solid #4B9EE5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4B9EE5' }} />
        </div>
        <span style={{ fontFamily: 'Fraunces, serif', color: 'white', fontSize: '16px' }}>
          Campus Circular
        </span>
      </div>
    </footer>
  )
}
