import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, animate } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Star, ShieldCheck, ShoppingCart, Shield, Sparkles, Code2 } from 'lucide-react'
import { SearchHero } from '@/components/discovery/SearchHero'
import { Footer } from '@/components/shared/Footer'
import GradientWaves from '@/components/shared/GradientWaves'
import { resources } from '@/data/resources'
import { ResourceCard } from '@/components/shared/ResourceCard'
import { ResourceModal } from '@/components/shared/ResourceModal'
import { BackendFeatures } from '@/components/shared/BackendFeatures'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

function Counter({ from, to, duration = 2 }) {
  const [count, setCount] = useState(from)
  
  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        setCount(Math.round(value))
      }
    })
    return () => controls.stop()
  }, [from, to, duration])

  return <span>{count}</span>
}

export default function HomePage() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2], [0.45, 0.85])

  const { currentUser, isAuthenticated, role, isDemoMode, logout } = useAuthStore()
  const { items, toggleCart } = useCartStore()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  const [selectedResource, setSelectedResource] = useState(null)
  const previewResources = resources.slice(0, 6)

  const handleSearch = () => {
    navigate('/discover')
  }

  const handleSignOut = () => {
    logout()
    navigate('/auth')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div style={{ minHeight: '100vh', color: 'white', position: 'relative' }}>
      
      {/* Parallax Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
        <motion.div
          style={{
            position: 'absolute', inset: '-10%',
            backgroundImage: "url('/src/assets/campus.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: bgY
          }}
        />
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgb(8, 12, 24)',
            opacity: overlayOpacity
          }}
        />
      </div>

      {/* Sticky Navbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '12px 24px', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-strong" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', borderRadius: '999px', width: '100%', maxWidth: '1080px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '18px' }}>
              Campus Circular
            </span>
            {isDemoMode && (
              <span style={{
                background: 'rgba(75, 158, 229, 0.18)', color: '#4B9EE5', border: '1px solid rgba(75, 158, 229, 0.3)',
                padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '4px'
              }}>
                <Sparkles size={11} /> Demo Session
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '28px', fontFamily: '"IBM Plex Sans", sans-serif', fontSize: '14px', alignItems: 'center' }}>
            {role === 'admin' ? (
              <>
                <Link to="/" style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}>Home</Link>
                <Link to="/discover" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Discover</Link>
                <Link to="/orders" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>My Orders</Link>
                <Link to="/requests" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Requests</Link>
                <Link to="/admin" style={{ color: 'rgba(248,113,113,0.8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={14}/> Admin Panel</Link>
              </>
            ) : (
              <>
                <Link to="/" style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}>Home</Link>
                <Link to="/discover" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Discover</Link>
                <Link to="/compare" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Compare</Link>
                <Link to="/orders" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>My Orders</Link>
                <Link to="/wishlist" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Wishlist</Link>
                <Link to="/requests" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Requests</Link>
              </>
            )}
            <a
              href="#backend-features"
              style={{
                color: '#4B9EE5',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
                background: 'rgba(75, 158, 229, 0.1)',
                padding: '4px 10px',
                borderRadius: '8px'
              }}
            >
              <Code2 size={13} /> Backend Features
            </a>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={toggleCart} style={{
              display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: 0
            }}>
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span style={{
                  background: '#4B9EE5', color: 'white', fontSize: '11px', fontWeight: 600,
                  padding: '2px 6px', borderRadius: '999px'
                }}>
                  {items.length}
                </span>
              )}
            </button>

            <div style={{ position: 'relative' }} ref={menuRef}>
              {!isAuthenticated ? (
                <button onClick={() => navigate('/auth')} style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', padding: '6px 16px', borderRadius: '999px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  Sign In
                </button>
              ) : (
                <>
                  <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: role === 'admin' ? 'rgba(248,113,113,0.2)' : 'rgba(74, 222, 128, 0.2)',
                    color: role === 'admin' ? '#F87171' : '#4ade80',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                  }}>
                    {currentUser.name.charAt(0)}
                  </button>
                  {showUserMenu && (
                    <div className="glass-strong" style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                      borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column',
                      gap: '8px', width: '220px', zIndex: 50
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: role === 'admin' ? 'rgba(248,113,113,0.2)' : 'rgba(74, 222, 128, 0.2)', color: role === 'admin' ? '#F87171' : '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
                          {currentUser.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.department} · {currentUser.year}</div>
                        </div>
                      </div>
                      <Link to={`/trust/${currentUser.id}`} onClick={() => setShowUserMenu(false)} style={{ color: 'white', fontSize: '13px', textDecoration: 'none', padding: '4px 0' }}>
                        View Profile →
                      </Link>
                      <Link to="/auth" onClick={() => setShowUserMenu(false)} style={{ color: 'white', fontSize: '13px', textDecoration: 'none', padding: '4px 0' }}>
                        Switch Account →
                      </Link>
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                      <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#F87171', fontSize: '13px', textAlign: 'left', padding: '4px 0', cursor: 'pointer' }}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', paddingTop: '80px', position: 'relative', overflow: 'hidden', zIndex: 10, marginTop: '-80px' }}>
        
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <GradientWaves
            horizonColor="#0A0F1E"
            waveColor="#1B3A6B"
            crestColor="#4B9EE5"
            speed={0.3}
            amplitude={2.0}
            waveScale={0.5}
            waveRatio={0.85}
            swell={30}
            turbulence={15}
            tilt={1.15}
            zoom={1.0}
            height={5.0}
            fogDepth={12}
            detail="medium"
            brightness={0.85}
            opacity={0.9}
            mouseInteraction={true}
            parallaxStrength={0.3}
            grain={true}
            grainIntensity={0.03}
          />
        </div>

        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'white', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '800px', margin: '0 auto 16px' }}>
            Borrow what you need,<br />
            <span style={{ color: '#4B9EE5' }}>from your campus.</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Tell us what you're trying to do. We'll find the perfect kit from students around you.
          </p>
          
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <SearchHero onSearch={handleSearch} theme="dark" />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['DSLR Camera', 'MacBook Charger', 'Scientific Calculator'].map(prompt => (
              <span key={prompt} className="glass" style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '12px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
                {prompt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: DISCOVER PREVIEW */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', marginBottom: '64px' }}>What's available right now</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1000px', width: '100%', marginBottom: '64px' }}>
          {previewResources.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ResourceCard resource={res} onClick={() => setSelectedResource(res)} />
            </motion.div>
          ))}
        </div>

        <Link to="/discover">
          <button className="glass-strong" style={{ padding: '16px 40px', borderRadius: '999px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
            See all resources →
          </button>
        </Link>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '32px', maxWidth: '1000px', width: '100%' }}>
          {[
            { num: '01', title: 'Describe your need', icon: <Search size={32} color="#4B9EE5" /> },
            { num: '02', title: 'We match resources', icon: <Star size={32} color="#FBBF24" /> },
            { num: '03', title: 'Borrow safely', icon: <ShieldCheck size={32} color="#4ADE80" /> },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="glass-card"
              style={{ flex: 1, padding: '40px', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}
            >
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '4rem', color: 'rgba(255,255,255,0.1)', lineHeight: 1, marginBottom: '24px' }}>{step.num}</span>
              {step.icon}
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', marginTop: '24px', marginBottom: '12px' }}>{step.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: IMPACT STATS */}
      <section style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        <div className="glass-strong" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px', maxWidth: '1000px', width: '100%', padding: '64px', borderRadius: '32px' }}>
          {[
            { value: 1284, prefix: '', suffix: '', label: 'Resources Reused' },
            { value: 4.8, prefix: '₹', suffix: 'L', label: 'Saved by borrowing' },
            { value: 82, prefix: '', suffix: '%', label: 'On-time returns' },
            { value: 320, prefix: '', suffix: '+', label: 'Students sharing' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 600, color: 'white', marginBottom: '8px' }}
              >
                {stat.prefix}<Counter from={0} to={stat.value} duration={2} />{stat.suffix}
              </motion.div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: BACKEND FEATURES */}
      <section id="backend-features" style={{ padding: '80px 24px', position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <BackendFeatures />
      </section>

      {/* SECTION 5: CTA */}
      <section style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '3.5rem', marginBottom: '32px' }}>Ready to borrow?</h2>
        <Link to="/discover">
          <button style={{ padding: '20px 48px', borderRadius: '999px', background: '#4B9EE5', color: 'white', border: 'none', fontSize: '18px', fontWeight: 600, cursor: 'pointer' }}>
            Start Discovering
          </button>
        </Link>
      </section>

      {/* Resource Modal */}
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          imageUrl={selectedResource.imageUrl}
        />
      )}
      
      <Footer />
    </div>
  )
}
