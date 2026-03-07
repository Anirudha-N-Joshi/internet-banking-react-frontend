import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { adminAPI } from '../../api'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
const fmtDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const statusBadge = (s) => ({ SUCCESS: 'badge-success', PENDING: 'badge-warning', FAILED: 'badge-danger' }[s] || 'badge-gray')

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        adminAPI.getAllTransactions()
            .then(r => setTransactions(r.data))
            .finally(() => setLoading(false))
    }, [])

    const filtered = transactions
        .filter(tx => filter === 'ALL' || tx.status === filter)
        .filter(tx => `${tx.transactionRef} ${tx.description} ${tx.fromAccount?.accountNumber} ${tx.toAccount?.accountNumber}`
            .toLowerCase().includes(search.toLowerCase()))

    return (
        <Layout>
            <div>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</div>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>All Transactions</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{transactions.length} total transactions</p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
                        {['ALL', 'SUCCESS', 'PENDING', 'FAILED'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: filter === f ? 'var(--accent)' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                {f}
                            </button>
                        ))}
                    </div>
                    <input className="input-field" placeholder="Search by ref, account..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '280px', marginLeft: 'auto' }} />
                </div>

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['Reference', 'From', 'To', 'Amount', 'Description', 'Status', 'Date'].map(h => (
                                            <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(tx => (
                                        <tr key={tx.id}
                                            style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{tx.transactionRef?.slice(0, 18)}…</td>
                                            <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{tx.fromAccount?.accountNumber}</td>
                                            <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{tx.toAccount?.accountNumber}</td>
                                            <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{fmt(tx.amount)}</td>
                                            <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description || '—'}</td>
                                            <td style={{ padding: '14px 20px' }}><span className={`badge ${statusBadge(tx.status)}`}>{tx.status}</span></td>
                                            <td style={{ padding: '14px 20px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{fmtDate(tx.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
