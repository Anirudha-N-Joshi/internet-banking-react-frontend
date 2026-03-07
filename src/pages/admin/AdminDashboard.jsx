import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { adminAPI } from '../../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        adminAPI.getStats()
            .then(r => setStats(r.data))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <Layout><div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div></Layout>

    const chartData = [
        { name: 'Active Accounts', value: stats.activeAccounts },
        { name: 'Suspended', value: stats.suspendedAccounts },
        { name: 'Successful Tx', value: stats.successfulTransactions },
        { name: 'Failed Tx', value: stats.failedTransactions },
    ]

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: '◈', color: '#3b82f6' },
        { label: 'Total Accounts', value: stats.totalAccounts, icon: '▣', color: '#10b981' },
        { label: 'Total Transactions', value: stats.totalTransactions, icon: '≡', color: '#f59e0b' },
        { label: 'Money in System', value: fmt(stats.totalMoneyInSystem), icon: '$', color: '#6366f1' },
    ]

    return (
        <Layout>
            <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Admin Panel
                    </div>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>System Overview</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Real-time statistics across all users and accounts</p>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                    {statCards.map(card => (
                        <div key={card.label} className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: card.color }} />
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>{card.label}</div>
                            <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                    {/* Bar chart */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '20px' }}>System Health</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData}>
                                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary box */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '20px' }}>Quick Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { label: 'Active Accounts', value: stats.activeAccounts, color: '#10b981' },
                                { label: 'Suspended Accounts', value: stats.suspendedAccounts, color: '#ef4444' },
                                { label: 'Successful Transfers', value: stats.successfulTransactions, color: '#10b981' },
                                { label: 'Failed Transfers', value: stats.failedTransactions, color: '#ef4444' },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{row.label}</span>
                                    <span style={{ fontWeight: 700, color: row.color, fontFamily: 'JetBrains Mono, monospace' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick nav cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {[
                        { label: 'Manage Users', to: '/admin/users', icon: '◈', desc: 'View, activate, deactivate users' },
                        { label: 'Manage Accounts', to: '/admin/accounts', icon: '▣', desc: 'Suspend or activate bank accounts' },
                        { label: 'All Transactions', to: '/admin/transactions', icon: '≡', desc: 'Monitor all system transactions' },
                    ].map(card => (
                        <a key={card.to} href={card.to} style={{ textDecoration: 'none' }}>
                            <div className="glass-card" style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{card.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{card.label}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{card.desc}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </Layout>
    )
}
