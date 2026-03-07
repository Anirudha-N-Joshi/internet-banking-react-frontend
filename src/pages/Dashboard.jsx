import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useAccounts, useTransactions } from '../hooks'
import { formatCurrency, formatDate, maskAccount, getStatusBadge } from '../utils/helpers'

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a2235', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '12px 16px', fontSize: '13px',
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: '600' }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user } = useAuth()

  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(user?.userId)

  const firstAccountId = accounts[0]?.id
  const { data: transactions = [], isLoading: txLoading } = useTransactions(firstAccountId)

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0)

  const chartData = transactions.slice(0, 7).reverse().map((tx) => ({
    name: formatDate(tx.createdAt),
    Income: tx.transactionType === 'CREDIT' ? Number(tx.amount) : 0,
    Spending: tx.transactionType === 'DEBIT' ? Number(tx.amount) : 0,
  }))

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <Layout>
      {/* Header */}
      <div className="animate-fadeInUp stagger-1" style={{ marginBottom: '36px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>{greeting()},</p>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          {user?.userName}
        </h1>
      </div>

      {/* Stats Row */}
      <div className="animate-fadeInUp stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Balance', value: formatCurrency(totalBalance), color: 'var(--accent)', sub: 'Across all accounts' },
          { label: 'Active Accounts', value: accounts.filter(a => a.status === 'ACTIVE').length, color: '#10b981', sub: `${accounts.length} total accounts` },
          { label: 'Transactions', value: transactions.length, color: '#f59e0b', sub: 'This period' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>{stat.label}</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: stat.color, marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
              {accountsLoading ? <span className="skeleton" style={{ width: '100px', height: '28px', display: 'block' }} /> : stat.value}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {/* Area Chart */}
        <div className="glass-card animate-fadeInUp stagger-3" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Cash Flow</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Income vs Spending</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[{ color: '#3b82f6', label: 'Income' }, { color: '#ef4444', label: 'Spending' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          {txLoading ? <Spinner /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Income" stroke="#3b82f6" strokeWidth={2} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="Spending" stroke="#ef4444" strokeWidth={2} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card animate-fadeInUp stagger-4" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Activity</h2>
            <Link to="/transactions" style={{ color: 'var(--accent)', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
              View all →
            </Link>
          </div>

          {txLoading ? <Spinner /> : transactions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No transactions yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {transactions.slice(0, 8).map((tx) => {
                const isCredit = tx.transactionType === 'CREDIT'
                return (
                  <div key={tx.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px', borderRadius: '10px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '10px',
                        background: isCredit ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', flexShrink: 0,
                      }}>
                        {isCredit ? '↓' : '↑'}
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                          {tx.description || (isCredit ? 'Received' : 'Sent')}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '14px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace',
                      color: isCredit ? 'var(--accent-green)' : 'var(--accent-red)',
                    }}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Accounts quick list */}
      {accounts.length > 0 && (
        <div className="glass-card animate-fadeInUp stagger-5" style={{ marginTop: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Your Accounts</h2>
            <Link to="/accounts" style={{ color: 'var(--accent)', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
              Manage →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {accounts.map(account => (
              <div key={account.id} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '16px 20px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>
                      {account.accountType}
                    </p>
                    <p className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{maskAccount(account.accountNumber)}</p>
                  </div>
                  <span className={`badge ${getStatusBadge(account.status)}`}>{account.status}</span>
                </div>
                <p style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>
                  {formatCurrency(account.balance, account.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
