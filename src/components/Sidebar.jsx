import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ path, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
)

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/accounts',      label: 'Accounts',      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { to: '/transfer',      label: 'Transfer',      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { to: '/transactions',  label: 'Transactions',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/cards',         label: 'Cards',         icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { to: '/beneficiaries', label: 'Beneficiaries', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/statement',     label: 'Statement',     icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { to: '/profile',       label: 'Profile',       icon: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z' },
]

const adminNavItems = [
  { to: '/admin', icon: '⊛', label: 'Overview' },
  { to: '/admin/users', icon: '◈', label: 'Users' },
  { to: '/admin/accounts', icon: '▣', label: 'Accounts' },
  { to: '/admin/transactions', icon: '≡', label: 'Transactions' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#0d1424',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--accent)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>NovaPay</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {/* Regular nav items */}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: '10px',
              marginBottom: '4px',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: isActive ? '600' : '400',
              transition: 'all 0.15s',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            })}
          >
            <Icon path={item.icon} size={17} />
            {item.label}
          </NavLink>
        ))}

        {/* Admin section — only visible to ADMIN role */}
        {user?.role === 'ADMIN' && (
          <div style={{ marginTop: '16px' }}>
            {/* Section label */}
            <div style={{
              padding: '6px 14px',
              fontSize: '10px',
              fontWeight: 700,
              color: '#f59e0b',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              Admin
            </div>

            {/* Admin nav links — using text icons since SVG paths aren't defined for them */}
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  marginBottom: '4px',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                })}
              >
                <span style={{ fontSize: '16px', width: '17px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* User info + Logout */}
      <div style={{ padding: '16px 12px 0', borderTop: '1px solid var(--border)', margin: '0 12px' }}>
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>Logged in as</p>
          <p style={{ fontSize: '13px', fontWeight: '500', wordBreak: 'break-all' }}>{user?.userName}</p>
          <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.15)',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s',
          }}
        >
          <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
