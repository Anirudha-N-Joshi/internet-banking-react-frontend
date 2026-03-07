import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      userName: form.userName,
      phoneNumber: form.phoneNumber,
      address: form.address,
      email: form.email,
      password: form.password,
    })

    if (result.success) {
      navigate('/login')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '40px 20px',
    }}>
      <div className="glass-card animate-fadeInUp" style={{ width: '100%', maxWidth: '480px', padding: '48px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--accent)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>NovaPay</span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Create account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          Get started with your free account today
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            color: '#ef4444', fontSize: '13px',
          }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* First + Last name side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                First Name
              </label>
              <input
                name="firstName"
                className="input-field"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                Last Name
              </label>
              <input
                name="lastName"
                className="input-field"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Username + Phone side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                Username
              </label>
              <input
                name="userName"
                className="input-field"
                placeholder="johndoe123"
                value={form.userName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="tel"
                className="input-field"
                placeholder="+1 234 567 8900"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Address
            </label>
            <input
              name="address"
              className="input-field"
              placeholder="123 Main Street, City, Country"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              className="input-field"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              className="input-field"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
