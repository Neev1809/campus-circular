import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore, DEMO_CREDENTIALS } from '@/store/authStore'
import {
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Server,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Info,
  Code2,
  X
} from 'lucide-react'
import { BackendFeatures } from '@/components/shared/BackendFeatures'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('demo') // 'demo' | 'live-login' | 'register'
  const [loginRole, setLoginRole] = useState('student') // 'student' | 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [serverError, setServerError] = useState(false)
  const [showBackendModal, setShowBackendModal] = useState(false)

  const navigate = useNavigate()
  const { login, loginDemo, register, loading, error, clearError } = useAuthStore()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setDepartment('')
    setYear('')
    setLocalError('')
    setServerError(false)
    setShowPassword(false)
    clearError()
  }

  // Pre-fill credentials when clicking presets
  const applyPreset = (presetRole) => {
    const creds = presetRole === 'admin' ? DEMO_CREDENTIALS.admin : DEMO_CREDENTIALS.student
    setEmail(creds.email)
    setPassword(creds.password)
    setLoginRole(presetRole)
    setLocalError('')
    setServerError(false)
  }

  // Handle Demo Login (1-click local simulated authenticated session)
  const handleDemoLogin = async (roleToUse = loginRole) => {
    setLocalError('')
    setServerError(false)
    try {
      await loginDemo(roleToUse)
      if (roleToUse === 'admin') {
        navigate('/admin')
      } else {
        navigate('/discover')
      }
    } catch (e) {
      setLocalError(e.message || 'Demo login failed')
    }
  }

  // Handle Live Java Backend Login
  const handleLiveLogin = async (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      setLocalError('Please enter both email and password')
      return
    }
    setLocalError('')
    setServerError(false)

    try {
      const user = await login(email, password)
      if (user.role?.toLowerCase() === 'admin') {
        navigate('/admin')
      } else {
        navigate('/discover')
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed')
      if (err.isNetworkError || (err.message && err.message.includes('Cannot connect'))) {
        setServerError(true)
      }
    }
  }

  // Handle Registration via Live Java Backend
  const handleRegister = async (e) => {
    if (e) e.preventDefault()
    if (!name || !email || !password) {
      setLocalError('Name, email, and password are required')
      return
    }
    setLocalError('')
    setServerError(false)

    try {
      await register({
        name,
        email,
        password,
        department,
        year: year ? parseInt(year) : undefined,
      })
      navigate('/discover')
    } catch (err) {
      setLocalError(err.message || 'Registration failed')
      if (err.isNetworkError || (err.message && err.message.includes('Cannot connect'))) {
        setServerError(true)
      }
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
    marginBottom: '6px',
    display: 'block',
    fontWeight: 500,
  }

  const displayError = localError || error

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div className="campus-bg" />

      {/* Main Auth Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '40px',
          borderRadius: '24px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(75, 158, 229, 0.15)',
              color: '#4B9EE5',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            <Sparkles size={14} /> Campus Circular Authentication
          </div>
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              color: 'white',
              fontSize: '26px',
              margin: '0 0 6px',
            }}
          >
            Sign In to Campus Circular
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', margin: 0 }}>
            Student equipment sharing &amp; platform governance
          </p>
        </div>

        {/* Tab Selection */}
        <div
          className="glass"
          style={{
            display: 'flex',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '24px',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('demo')
              resetForm()
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === 'demo' ? '#4B9EE5' : 'transparent',
              color: activeTab === 'demo' ? 'white' : 'rgba(255, 255, 255, 0.65)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} /> Demo Login
          </button>

          <button
            onClick={() => {
              setActiveTab('live-login')
              resetForm()
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === 'live-login' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
              color: activeTab === 'live-login' ? 'white' : 'rgba(255, 255, 255, 0.65)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Server size={14} /> Java Backend
          </button>

          <button
            onClick={() => {
              setActiveTab('register')
              resetForm()
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === 'register' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
              color: activeTab === 'register' ? 'white' : 'rgba(255, 255, 255, 0.65)',
              transition: 'all 0.2s',
            }}
          >
            Register
          </button>
        </div>

        {/* ── TAB 1: DEMO LOGIN (Guaranteed Access) ────────────────────── */}
        {activeTab === 'demo' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Notice banner */}
            <div
              style={{
                background: 'rgba(75, 158, 229, 0.1)',
                border: '1px solid rgba(75, 158, 229, 0.25)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <Info size={18} color="#4B9EE5" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.4 }}>
                <strong style={{ color: 'white' }}>Demo Mode Active:</strong> Simulates a verified
                authenticated session locally so you can immediately explore all student &amp; admin screens
                without requiring PostgreSQL.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {/* Option A: Student Demo Card */}
              <div
                className="glass"
                style={{
                  padding: '18px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'border-color 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px' }}>🎓</span>
                    <strong style={{ color: 'white', fontSize: '15px' }}>Student Demo</strong>
                    <span
                      style={{
                        background: 'rgba(74, 222, 128, 0.2)',
                        color: '#4ade80',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontWeight: 600,
                      }}
                    >
                      Trust 94%
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '2px' }}>
                    Arjun Mehta • CS Year 3
                  </div>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    arjun.mehta@campus.edu / password123
                  </div>
                </div>

                <button
                  onClick={() => handleDemoLogin('student')}
                  disabled={loading}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    background: '#4B9EE5',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    boxShadow: '0 4px 15px rgba(75, 158, 229, 0.3)',
                  }}
                >
                  {loading ? <Loader2 size={14} className="spin" /> : 'Log In →'}
                </button>
              </div>

              {/* Option B: Admin Demo Card */}
              <div
                className="glass"
                style={{
                  padding: '18px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px' }}>⚙️</span>
                    <strong style={{ color: 'white', fontSize: '15px' }}>Admin Demo</strong>
                    <span
                      style={{
                        background: 'rgba(248, 113, 113, 0.2)',
                        color: '#F87171',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontWeight: 600,
                      }}
                    >
                      Full Governance
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '2px' }}>
                    System Administrator • Admin Console
                  </div>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    admin@campus.edu / admin123
                  </div>
                </div>

                <button
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    background: '#F87171',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    boxShadow: '0 4px 15px rgba(248, 113, 113, 0.3)',
                  }}
                >
                  {loading ? <Loader2 size={14} className="spin" /> : 'Admin In →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 2: LIVE JAVA BACKEND LOGIN ─────────────────────────── */}
        {activeTab === 'live-login' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Server endpoint status note */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                <Server size={14} color="#4B9EE5" />
                <span>Target: <code>POST http://localhost:8080/api/auth/login</code></span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => applyPreset('student')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'white',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Fill Student
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('admin')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'white',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Fill Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleLiveLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Campus Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun.mehta@campus.edu"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Alert Display */}
              {displayError && (
                <div
                  style={{
                    background: serverError ? 'rgba(251, 191, 36, 0.12)' : 'rgba(248, 113, 113, 0.12)',
                    border: serverError ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: serverError ? '#fbbf24' : '#F87171',
                    fontSize: '13px',
                    lineHeight: 1.4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>{displayError}</div>
                  </div>

                  {serverError && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(251, 191, 36, 0.2)' }}>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('student')}
                        style={{
                          background: '#fbbf24',
                          color: '#78350f',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ⚡ Switch to Demo Mode &amp; Continue →
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#4B9EE5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" /> Authenticating with Java Backend...
                  </>
                ) : (
                  'Sign In via Java Backend'
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── TAB 3: REGISTER ACCOUNT ────────────────────────────────── */}
        {activeTab === 'register' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Mehta"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Campus Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Password (min. 4 chars) *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Department</label>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Graduation Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    style={inputStyle}
                  />
                </div>
              </div>

              {displayError && (
                <div
                  style={{
                    background: 'rgba(248, 113, 113, 0.12)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#F87171',
                    fontSize: '13px',
                  }}
                >
                  {displayError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#4B9EE5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                }}
              >
                {loading ? <Loader2 size={18} className="spin" /> : 'Create Account via Java Backend'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <button
            type="button"
            onClick={() => setShowBackendModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#4B9EE5',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            <Code2 size={14} /> Backend Architecture
          </button>
        </div>
      </motion.div>

      {/* Backend Features Modal */}
      <AnimatePresence>
        {showBackendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '1150px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <BackendFeatures onClose={() => setShowBackendModal(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
