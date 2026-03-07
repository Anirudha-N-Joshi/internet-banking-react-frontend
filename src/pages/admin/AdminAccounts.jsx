import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { adminAPI } from '../../api'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

const statusBadge = (s) => ({ ACTIVE: 'badge-success', SUSPENDED: 'badge-danger', CLOSED: 'badge-gray', INACTIVE: 'badge-warning' }[s] || 'badge-gray')

export default function AdminAccounts() {
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const load = () => {
        adminAPI.getAllAccounts()
            .then(r => setAccounts(r.data))
            .finally(() => setLoading(false))
    }
    useEffect(() => { load() }, [])

    const handleStatusChange = async (account, newStatus) => {
        await adminAPI.updateAccountStatus(account.id, newStatus)
        load()
    }

    const filtered = accounts.filter(a =>
        `${a.accountNumber} ${a.accountType} ${a.status}`
            .toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Layout>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</div>
                        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>Account Management</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{accounts.length} total accounts</p>
                    </div>
                    <input className="input-field" placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '260px' }} />
                </div>

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Account Number', 'Type', 'Balance', 'Currency', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(acc => (
                                    <tr key={acc.id}
                                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>{acc.accountNumber}</td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px' }}>{acc.accountType?.replace('_', ' ')}</td>
                                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700 }}>{fmt(acc.balance)}</td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>{acc.currency}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span className={`badge ${statusBadge(acc.status)}`}>{acc.status}</span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {acc.status !== 'CLOSED' && (
                                                    <>
                                                        {acc.status !== 'SUSPENDED' && (
                                                            <button onClick={() => handleStatusChange(acc, 'SUSPENDED')}
                                                                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                                                                Suspend
                                                            </button>
                                                        )}
                                                        {acc.status === 'SUSPENDED' && (
                                                            <button onClick={() => handleStatusChange(acc, 'ACTIVE')}
                                                                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: '#10b981', fontSize: '12px', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                                                                Activate
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleStatusChange(acc, 'CLOSED')}
                                                            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                                                            Close
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    )
}
