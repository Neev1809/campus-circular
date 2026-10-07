import { Sidebar } from '@/components/shared/Sidebar'
import { Footer } from '@/components/shared/Footer'

export function InnerLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Background */}
      <div className="campus-bg" />
      {/* Sidebar */}
      <Sidebar />
      {/* Content */}
      <main style={{
        marginLeft: '200px',
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '32px', flex: 1 }}>
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}

InnerLayout.displayName = 'InnerLayout'
