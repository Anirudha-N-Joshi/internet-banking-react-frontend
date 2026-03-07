import React, { useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useAccounts, useBeneficiaries, useTransfer } from '../hooks'
import { accountsAPI } from '../api'
import { formatCurrency, maskAccount } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function Transfer() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
    description: '',
    useBeneficiary: false,
  })
  const [recipientName, setRecipientName] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [successData, setSuccessData] = useState(null)

  const { user } = useAuth();
  const { data: accounts = [] } = useAccounts(user?.userId)
  const { data: beneficiaries = [] } = useBeneficiaries()
  const transfer = useTransfer()

  const handleLookup = async () => {
    if (!form.toAccountNumber) return
    setLookupLoading(true)
    setLookupError('')
    setRecipientName('')
    try {
      const res = await accountsAPI.lookup(form.toAccountNumber)
      setRecipientName(res.data.accountHolderName || res.data)
    } catch {
      setLookupError('Account not found. Please check the number.')
    }
    setLookupLoading(false)
  }

  const handleBeneficiarySelect = (e) => {
    const b = beneficiaries.find(b => b.id === parseInt(e.target.value))
    if (b) {
      setForm(p => ({ ...p, toAccountNumber: b.accountNumber }))
      setRecipientName(b.accountHolderName)
    }
  }

  const handleSubmit = async () => {
    const result = await transfer.mutateAsync({
      fromAccountNumber: form.fromAccountNumber,
      toAccountNumber: form.toAccountNumber,
      amount: parseFloat(form.amount),
      description: form.description,
    })
    setSuccessData(result)
    setStep(3)
  }

const fromAccount = accounts.find(a => a.accountNumber === form.fromAccountNumber)

  if (step === 3) {
    return (
      <Layout>
        <div style={{ maxWidth: '480px', margin: '60px auto', textAlign: 'center' }}>
          <div className="glass-card animate-fadeInUp" style={{ padding: '48px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
            }}>✓</div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Transfer Successful!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
              Your funds have been transferred successfully.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
              {[
                { label: 'Amount', value: formatCurrency(form.amount) },
                { label: 'To', value: recipientName },
                { label: 'Account', value: form.toAccountNumber },
                { label: 'Ref', value: successData?.transactionRef || '—' },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{d.label}</span>
                  <span className="mono" style={{ fontSize: '13px', fontWeight: '500' }}>{d.value}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => { setStep(1); setForm({ fromAccountNumber: '', toAccountNumber: '', amount: '', description: '', useBeneficiary: false }); setRecipientName('') }}>
              Make Another Transfer
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div className="animate-fadeInUp stagger-1" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Transfer Funds</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Send money to any account instantly</p>
        </div>

        {/* Step indicator */}
        <div className="animate-fadeInUp stagger-2" style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {['Details', 'Review'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step > i + 1 ? '#10b981' : step === i + 1 ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '600', color: step >= i + 1 ? 'white' : 'var(--text-muted)',
                transition: 'all 0.3s',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '13px', color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: step === i + 1 ? '600' : '400' }}>
                {label}
              </span>
              {i === 0 && <div style={{ width: 40, height: 1, background: 'var(--border)' }} />}
            </div>
          ))}
        </div>

        <div className="glass-card animate-fadeInUp stagger-3" style={{ padding: '32px' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* From account */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  From Account
                </label>
                <select
                  className="input-field"
                  value={form.fromAccountNumber}
                  onChange={(e) => setForm(p => ({ ...p, fromAccountNumber: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}
                  required
                >
                  <option value=""  style={{ background: '#111827', color: 'var(--text-primary)' }}>Select account...</option>
                  {accounts.filter(a => a.status === 'ACTIVE').map(a => (
                    <option key={a.id} value={a.accountNumber}  style={{ background: '#111827', color: 'var(--text-primary)' }}>
                      {a.accountType} — {maskAccount(a.accountNumber)} ({formatCurrency(a.balance, a.currency)})
                    </option>
                  ))}
                </select>
                {fromAccount && (
                  <p style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>
                    Available: {formatCurrency(fromAccount.balance, fromAccount.currency)}
                  </p>
                )}
              </div>

              {/* Beneficiary quick-select */}
              {beneficiaries.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    Quick Select — Saved Recipient
                  </label>
                  <select
                    className="input-field"
                    onChange={handleBeneficiarySelect}
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}
                  >
                    <option value="" style={{ background: '#111827', color: 'var(--text-primary)' }}>Or pick a saved recipient...</option>
                    {beneficiaries.map(b => (
                      <option key={b.id} value={b.id} style={{ background: '#111827', color: 'var(--text-primary)' }}>
                        {b.nickName} — {b.accountHolderName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* To account number */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  Recipient Account Number
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    className="input-field"
                    placeholder="Enter account number"
                    value={form.toAccountNumber}
                    onChange={(e) => { setForm(p => ({ ...p, toAccountNumber: e.target.value })); setRecipientName(''); setLookupError('') }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleLookup}
                    style={{ width: 'auto', padding: '12px 18px', whiteSpace: 'nowrap' }}
                  >
                    {lookupLoading ? '...' : 'Verify'}
                  </button>
                </div>
                {recipientName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                    <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '500' }}>{recipientName}</span>
                  </div>
                )}
                {lookupError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{lookupError}</p>}
              </div>

              {/* Amount */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  Amount
                </label>
                <input
                  className="input-field mono"
                  type="number"
                  placeholder="0.00"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                  Description <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(optional)</span>
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Rent for March"
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={!form.fromAccountNumber || !form.toAccountNumber || !form.amount || !recipientName}
                style={{ marginTop: '8px' }}
              >
                Review Transfer →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>Confirm Transfer</h3>

              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                {[
                  { label: 'From', value: `${fromAccount?.accountType} (${maskAccount(fromAccount?.accountNumber)})` },
                  { label: 'To', value: `${recipientName} (${form.toAccountNumber})` },
                  { label: 'Amount', value: formatCurrency(form.amount) },
                  { label: 'Description', value: form.description || '—' },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{d.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{d.value}</span>
                  </div>
                ))}
              </div>

              {transfer.isError && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
                  {transfer.error?.response?.data?.error || 'Transfer failed. Please try again.'}
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={transfer.isPending}>
                  {transfer.isPending ? 'Processing...' : 'Confirm & Send'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
