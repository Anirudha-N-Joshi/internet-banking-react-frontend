import React, { useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import { useAccounts, useCreateAccount, useDeleteAccount } from '../hooks'
import { formatCurrency, formatDate, maskAccount, getStatusBadge } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function Accounts() {
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ accountType: 'SAVINGS', currency: 'INR' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const { user } = useAuth();
  const { data: accounts = [], isLoading } = useAccounts(user?.userId)
  const createAccount = useCreateAccount()
  const deleteAccount = useDeleteAccount()

  const handleCreate = async (e) => {
    e.preventDefault()
    await createAccount.mutateAsync({
      accountType: form.accountType,
      currency: form.currency,
      initialDeposit: parseFloat(form.initialDeposit),
      userId: user?.userId,
    })
    setShowCreate(false)
    setForm({ accountType: 'SAVINGS', currency: 'INR', initialDeposit: '' })
  }

  const handleDelete = async () => {
    await deleteAccount.mutateAsync(deleteConfirm.id)
    setDeleteConfirm(null)
  }

  return (
    <Layout>
      {/* Header */}
      <div className="animate-fadeInUp stagger-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Accounts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{accounts.length} account{accounts.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '11px 22px' }} onClick={() => setShowCreate(true)}>
          + New Account
        </button>
      </div>

      {isLoading ? <Spinner text="Loading accounts..." /> : (
        <div className="animate-fadeInUp stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {accounts.map(account => (
            <div key={account.id} className="glass-card" style={{ padding: '28px', cursor: 'default' }}>
              {/* Card top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {account.accountType?.replace('_', ' ')}
                  </p>
                  <p className="mono" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {maskAccount(account.accountNumber)}
                  </p>
                </div>
                <span className={`badge ${getStatusBadge(account.status)}`}>{account.status}</span>
              </div>

              {/* Balance */}
              <p style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', marginBottom: '20px' }}>
                {formatCurrency(account.balance, account.currency)}
              </p>

              {/* Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Currency', value: account.currency },
                  { label: 'Opened', value: formatDate(account.createdAt) },
                  { label: 'Account No.', value: account.accountNumber },
                ].map(d => (
                  <div key={d.label}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{d.label}</p>
                    <p className="mono" style={{ fontSize: '12px', fontWeight: '500' }}>{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {account.status !== 'CLOSED' && (
                <button
                  className="btn-danger"
                  style={{ width: '100%' }}
                  onClick={() => setDeleteConfirm(account)}
                >
                  Close Account
                </button>
              )}
            </div>
          ))}

          {accounts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>🏦</p>
              <p style={{ fontWeight: '600', marginBottom: '8px' }}>No accounts yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Create your first account to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Create Account Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Account">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Account Type
            </label>
            {/* Select dropdown for account type */}
            <select
              className="input-field"
              value={form.accountType}
              onChange={(e) => setForm(p => ({ ...p, accountType: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}
            >
              <option value="SAVINGS" style={{ background: '#111827', color: 'var(--text-primary)' }}>Savings</option>
              <option value="CURRENT" style={{ background: '#111827', color: 'var(--text-primary)' }}>Current</option>
              <option value="FIXED_DEPOSIT" style={{ background: '#111827', color: 'var(--text-primary)' }}>Fixed Deposit</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Currency
            </label>
            <select
              className="input-field"
              value={form.currency}
              onChange={(e) => setForm(p => ({ ...p, currency: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}
            >
              <option value="INR" style={{ background: '#111827', color: 'var(--text-primary)' }}>INR — Indian Rupee</option>
              <option value="USD" style={{ background: '#111827', color: 'var(--text-primary)' }}>USD — US Dollar</option>
              <option value="EUR" style={{ background: '#111827', color: 'var(--text-primary)' }}>EUR — Euro</option>
              <option value="GBP" style={{ background: '#111827', color: 'var(--text-primary)' }}>GBP — British Pound</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Initial Deposit
            </label>
            <input
              type="number"
              className="input-field mono"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.initialDeposit}
              onChange={(e) => setForm(p => ({ ...p, initialDeposit: e.target.value }))}
              required
            />
          </div>

          {createAccount.isError && (
            <p style={{ color: '#ef4444', fontSize: '13px' }}>
              {createAccount.error?.response?.data?.message || 'Failed to create account'}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={createAccount.isPending}>
              {createAccount.isPending ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Close Account" width="400px">
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          Are you sure you want to close account <span className="mono" style={{ color: 'var(--text-primary)' }}>{deleteConfirm?.accountNumber}</span>?
          This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button
            className="btn-danger"
            style={{ width: '100%' }}
            onClick={handleDelete}
            disabled={deleteAccount.isPending}
          >
            {deleteAccount.isPending ? 'Closing...' : 'Yes, Close Account'}
          </button>
        </div>
      </Modal>
    </Layout>
  )
}
