import { Link } from 'react-router-dom'
import { InnerLayout } from '@/components/shared/InnerLayout'
import { GlassPage } from '@/components/shared/GlassPage'
import { ResourceCard } from '@/components/shared/ResourceCard'
import { useWishlistStore } from '@/store/wishlistStore'

export default function WishlistPage() {
  const { items } = useWishlistStore()

  return (
    <GlassPage title="Wishlist" subtitle="Resources you've saved for later">
      
      {items.length === 0 ? (
        <div className="glass" style={{ padding: '48px', textAlign: 'center', borderRadius: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Nothing saved yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Tap the heart icon on any resource to save it for later.</p>
          <Link to="/discover" style={{ display: 'inline-block', padding: '12px 24px', background: '#4B9EE5', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>
            Browse resources →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
          {items.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

    </GlassPage>
  )
}
