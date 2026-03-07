import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import { adminAPI } from '../../api'

const statusBadge = (status) => {
    const map = { ACTIVE: 'badge-success', INACTIVE: 'badge-warning', SUSPENDED: 'badge-danger' }
    return map[status] || 'badge-gray'
}

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)

    const load = () => {
        adminAPI.getAllUsers()
            .then(r => setUsers(r.data))
            .finally(() => setLoading(false))
    }
    useEffect(() => { load() }, [])

    const handleStatusToggle = async (user) => {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        await adminAPI.updateUserStatus(user.id, newStatus)
        load()
    }

    const handleDelete = async (userId) => {
        if (!window.confirm('Permanently delete this user?')) return
        await adminAPI.deleteUser(userId)
        setSelected(null)
        load()
    }

    const filtered = users.filter(u =>
        `${u.firstName} ${u.lastName} ${u.email} ${u.userName}`
            .toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Layout>
            <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</div>
                        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>User Management</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{users.length} total users</p>
                    </div>
                    <input
                        className="input-field"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '260px' }}
                    />
                </div>

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['User', 'Username', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.id}
                                        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                                    {(u.firstName?.[0] || '?').toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 500, fontSize: '14px' }}>{u.firstName} {u.lastName}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>@{u.userName}</td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>{u.email}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span className={`badge ${u.role === 'ADMIN' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span className={`badge ${statusBadge(u.userStatus)}`}>{u.userStatus || 'ACTIVE'}</span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => setSelected(u)}
                                                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleStatusToggle(u)}
                                                    style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${u.userStatus === 'ACTIVE' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, background: 'transparent', color: u.userStatus === 'ACTIVE' ? '#ef4444' : '#10b981', fontSize: '12px', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                                                >
                                                    {u.userStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* User Detail Modal */}
            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="User Details" width="480px">
                {selected && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                                {(selected.firstName?.[0] || '?').toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '16px' }}>{selected.firstName} {selected.lastName}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>@{selected.userName}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            {[
                                { label: 'Email', value: selected.email },
                                { label: 'Phone', value: selected.phoneNumber },
                                { label: 'Address', value: selected.address },
                                { label: 'Role', value: selected.role },
                                { label: 'Status', value: selected.userStatus },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{row.label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{row.value || '—'}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
                            <button className="btn-danger" style={{ width: '100%' }} onClick={() => handleDelete(selected.id)}>
                                Delete User
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    )
}
