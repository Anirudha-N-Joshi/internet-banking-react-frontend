import React, { useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useAccounts, useTransactions } from '../hooks'
import { formatCurrency, formatDateTime, getStatusBadge, maskAccount } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function Transactions() {
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const { user } = useAuth();
  
  const { data: accounts = [] } = useAccounts(user?.userId)
  const activeId = selectedAccountId || accounts[0]?.id
  const { data: transactions = [], isLoading } = useTransactions(activeId)

  const filtered = transactions.filter(tx => {
    if (filter === 'CREDIT') return tx.transactionType === 'CREDIT'
    if (filter === 'DEBIT')  return tx.transactionType === 'DEBIT'
    return true
})

  return (
    <Layout>
      {/* Header */}
      <div className="animate-fadeInUp stagger-1" style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Transactions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Full history of your account activity</p>
      </div>

      {/* Controls */}
      <div className="animate-fadeInUp stagger-2" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* Account selector */}
        <select
          className="input-field"
          style={{ width: 'auto', minWidth: '240px', background: '#111827', color: 'var(--text-primary)' }}
          value={activeId || ''}
          onChange={(e) => setSelectedAccountId(parseInt(e.target.value))}
        >
          {accounts.map(a => (
            <option key={a.id} value={a.id}>
              {a.accountType} — {maskAccount(a.accountNumber)}
            </option>
          ))}
        </select>

        {/* Filter tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border)' }}>
          {['ALL', 'CREDIT', 'DEBIT'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontSize: '13px',
                fontWeight: '500',
                background: filter === tab ? 'var(--accent)' : 'transparent',
                color: filter === tab ? 'white' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <span style={{ color: 'var(--text-muted)', fontSize: '13px', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} transactions
        </span>
      </div>

      {/* Transactions Table */}
      <div className="glass-card animate-fadeInUp stagger-3" style={{ overflow: 'hidden' }}>
        {isLoading ? <Spinner text="Loading transactions..." /> : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '36px', marginBottom: '12px' }}>📋</p>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>No transactions found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {filter !== 'ALL' ? `No ${filter.toLowerCase()} transactions` : 'Make your first transfer to see activity here'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Reference', 'Type', 'Amount', 'Balance After', 'Description', 'Status', 'Date'].map(h => (
                  <th key={h} style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => {
                const isCredit = tx.transactionType === 'CREDIT'
                return (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                      animation: `fadeInUp 0.3s ease ${i * 0.03}s both`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {tx.transactionRef?.slice(0, 16)}…
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: '600',
                        color: isCredit ? 'var(--accent-green)' : 'var(--accent-red)',
                      }}>
                        {isCredit ? '↓ Credit' : '↑ Debit'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="mono" style={{
                        fontSize: '14px', fontWeight: '700',
                        color: isCredit ? 'var(--accent-green)' : 'var(--accent-red)',
                      }}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {formatCurrency(tx.balanceAfter)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', maxWidth: '160px' }}>
                      <span style={{ fontSize: '13px', color: tx.description ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {tx.description || 'Fund transfer'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className={`badge ${getStatusBadge(tx.status)}`}>{tx.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDateTime(tx.createdAt)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
