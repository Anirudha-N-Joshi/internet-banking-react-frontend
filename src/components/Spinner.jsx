import React from 'react'

export default function Spinner({ size = 32, text = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px' }}>
      <div style={{
        width: size, height: size,
        border: '2px solid rgba(59,130,246,0.2)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      {text && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
