import { Navbar } from '@/components/shared/Navbar'
import { AppRouter } from '@/router'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main>
        <AppRouter />
      </main>
    </div>
  )
}
