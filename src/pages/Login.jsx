import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [UserName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(UserName, password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-primary)',
    }}>
      {/* Left Panel — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        background: 'linear-gradient(135deg, #0d1424 0%, #0a0f1e 100%)',
        borderRight: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '50px', right: '-50px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
            <div style={{
              width: 44, height: 44,
              background: 'var(--accent)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '20px' }}>NovaPay</span>
          </div>

          <h1 style={{ fontSize: '40px', fontWeight: '700', lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-1px' }}>
            Your money,<br />
            <span style={{ color: 'var(--accent)' }}>intelligently</span><br />
            managed.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, maxWidth: '340px' }}>
            Secure banking with real-time transfers, smart analytics, and complete control over your finances.
          </p>

          {/* Feature bullets */}
          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Instant fund transfers',
              'Real-time transaction history',
              'Virtual & physical card management',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        width: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
      }}>
        <div className="animate-fadeInUp">
          <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '36px' }}>
            Sign in to your account to continue
          </p>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#ef4444',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* UserName */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                User Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '13px',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
