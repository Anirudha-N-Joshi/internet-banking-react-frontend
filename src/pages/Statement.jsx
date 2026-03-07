import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useAccounts } from '../hooks'
import { accountsAPI } from '../api'
import { maskAccount, downloadPDF } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function Statement() {
  const [selectedAccount, setSelectedAccount] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { user } = useAuth();
  
  const { data: accounts = [] } = useAccounts(user?.userId)

  const handleDownload = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!selectedAccount) { setError('Please select an account'); return }
    if (!fromDate || !toDate) { setError('Please select a date range'); return }
    if (new Date(fromDate) > new Date(toDate)) { setError('Start date must be before end date'); return }

    setLoading(true)
    try {
      const response = await accountsAPI.getStatement(selectedAccount, fromDate, toDate)

      downloadPDF(response.data, `statement-${selectedAccount}-${fromDate}-to-${toDate}.pdf`)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate statement. Try a different date range.')
    }
    setLoading(false)
  }

  const setPreset = (days) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    setFromDate(from.toISOString().split('T')[0])
    setToDate(to.toISOString().split('T')[0])
  }

  return (
    <Layout>
      <div className="animate-fadeInUp stagger-1" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Account Statement</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Download a PDF statement for any date range</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', maxWidth: '900px' }}>
        {/* Form */}
        <div className="glass-card animate-fadeInUp stagger-2" style={{ padding: '32px' }}>
          <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Account select */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                Account
              </label>
              <select
                className="input-field"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}
                required
              >
                <option value=""  style={{ background: '#111827', color: 'var(--text-primary)' }}>Select account...</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}  style={{ background: '#111827', color: 'var(--text-primary)' }}>
                    {a.accountType} — {maskAccount(a.accountNumber)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  From Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  To Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{ colorScheme: 'dark' }}
                  required
                />
              </div>
            </div>

            {/* Quick presets */}
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Quick Select</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Last 7 days', days: 7 },
                  { label: 'Last 30 days', days: 30 },
                  { label: 'Last 90 days', days: 90 },
                  { label: 'Last 6 months', days: 180 },
                ].map(preset => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => setPreset(preset.days)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'Sora, sans-serif',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', color: '#ef4444', fontSize: '13px' }}>
                ⚠ {error}
              </div>
            )}
            {success && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '12px 16px', color: '#10b981', fontSize: '13px' }}>
                ✓ Statement downloaded successfully!
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Generating PDF...' : '⬇ Download Statement'}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card animate-fadeInUp stagger-3" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>What's included</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📋', text: 'Complete transaction history' },
                { icon: '💰', text: 'Opening & closing balance' },
                { icon: '📊', text: 'Total credits and debits' },
                { icon: '🔢', text: 'Transaction references' },
                { icon: '📄', text: 'Formatted PDF document' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card animate-fadeInUp stagger-4" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Tips</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Statements are generated in PDF format. Maximum date range is 1 year. 
              For longer periods, generate multiple statements.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
