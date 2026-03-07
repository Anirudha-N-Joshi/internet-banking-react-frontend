import React, { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, width = '480px' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#151f35',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '32px',
          width,
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'fadeInUp 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: '16px',
              lineHeight: 1,
              transition: 'background 0.2s',
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
