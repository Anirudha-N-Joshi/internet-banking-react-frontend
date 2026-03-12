import React, { useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import { useCards, useCreateCard, useUpdateCardStatus, useDeleteCard } from '../hooks'
import { useAccounts } from '../hooks'
import { formatDate, getStatusBadge } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

function BankCard({ card }) {
  const gradients = {
    DEBIT:   'linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)',
    CREDIT:  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    PREPAID: 'linear-gradient(135deg, #0d2137 0%, #1a3a4a 100%)',
  }

  return (
    <div style={{
      background: gradients[card.cardType] || gradients.DEBIT,
      borderRadius: '18px',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '1.586',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    }}>
      {/* Chip */}
      <div style={{
        width: 36, height: 28, borderRadius: '5px',
        background: 'linear-gradient(135deg, #d4af37, #f0e68c)',
        marginBottom: '28px',
      }} />

      {/* Card number */}
      <p className="mono" style={{ fontSize: '17px', letterSpacing: '3px', marginBottom: '20px', color: 'rgba(255,255,255,0.9)' }}>
        {card.cardNumber}
      </p>

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Card Holder</p>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{card.cardHolderName}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Expires</p>
          <p className="mono" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>{card.expiryDate}</p>
        </div>
      </div>

      {/* Card type badge */}
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
          {card.cardType}
        </span>
      </div>

      {/* Blocked overlay */}
      {card.status === 'BLOCKED' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '18px',
          backdropFilter: 'blur(2px)',
        }}>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            🔒 Blocked
          </span>
        </div>
      )}
    </div>
  )
}

export default function Cards() {
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ cardType: 'DEBIT', accountId: '' })

  const { user } = useAuth();
  
  const { data: cards = [], isLoading } = useCards()
  const { data: accounts = [] } = useAccounts(user?.userId)
  const createCard = useCreateCard()
  const updateStatus = useUpdateCardStatus()
  const deleteCard = useDeleteCard()

  const handleCreate = async (e) => {
    e.preventDefault()
    await createCard.mutateAsync(form)
    setShowCreate(false)
  }

  const toggleBlock = async (card) => {
    const newStatus = card.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'
    await updateStatus.mutateAsync({ cardId: card.id, status: newStatus })
  }

  return (
    <Layout>
      <div className="animate-fadeInUp stagger-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Cards</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {cards.length} of 5 cards used
          </p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '11px 22px' }} onClick={() => setShowCreate(true)}>
          + New Card
        </button>
      </div>

      {isLoading ? <Spinner text="Loading cards..." /> : (
        <div className="animate-fadeInUp stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {cards.map((card, i) => (
            <div key={card.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
              <BankCard card={card} />

              {/* Card Actions */}
              <div className="glass-card" style={{ padding: '20px', marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`badge ${getStatusBadge(card.status)}`}>{card.status}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issued {formatDate(card.createdAt)}</span>
                </div>

                {card.cardType === 'CREDIT' && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Credit Used</span>
                      <span className="mono" style={{ fontSize: '12px' }}>
                        {card.currentBalance} / {card.creditLimit}
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                      <div style={{
                        height: '100%',
                        width: `${(card.currentBalance / card.creditLimit) * 100}%`,
                        background: 'var(--accent)',
                        borderRadius: '2px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  {(card.status === 'ACTIVE' || card.status === 'BLOCKED') && (
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '13px', padding: '10px 16px' }}
                      onClick={() => toggleBlock(card)}
                      disabled={updateStatus.isPending}
                    >
                      {card.status === 'BLOCKED' ? '🔓 Unblock' : '🔒 Block'}
                    </button>
                  )}
                  {card.status !== 'CANCELLED' && (
                    <button
                      className="btn-danger"
                      onClick={() => deleteCard.mutate(card.id)}
                      disabled={deleteCard.isPending}
                    >
                      Cancel Card
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {cards.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>💳</p>
              <p style={{ fontWeight: '600', marginBottom: '8px' }}>No cards yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Apply for your first card to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Create Card Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Apply for New Card">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Card Type
            </label>
            <select
              className="input-field"
              value={form.cardType}
              onChange={(e) => setForm(p => ({ ...p, cardType: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}
            >
              <option value="DEBIT" style={{ background: '#111827', color: 'var(--text-primary)' }}>Debit Card</option>
              <option value="CREDIT" style={{ background: '#111827', color: 'var(--text-primary)' }}>Credit Card</option>
              <option value="PREPAID" style={{ background: '#111827', color: 'var(--text-primary)' }}>Prepaid Card</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Link to Account
            </label>
            <select
              className="input-field"
              value={form.accountId}
              onChange={(e) => setForm(p => ({ ...p, accountId: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}
              required
            >
              <option value="" style={{ background: '#111827', color: 'var(--text-primary)' }}>Select account...</option>
              {accounts.filter(a => a.status === 'ACTIVE').map(a => (
                <option key={a.id} value={a.id} style={{ background: '#111827', color: 'var(--text-primary)' }}>
                  {a.accountType} — {a.accountNumber}
                </option>
              ))}
            </select>
          </div>

          {form.cardType === "CREDIT" && (
            <div>
              <label
                style={{  display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)'
                }}
              >
                Credit Limit
              </label>

              <input
                type="number" className="input-field" placeholder="Enter credit limit" value={form.creditLimit || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, creditLimit: e.target.value }))
                }
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-primary)'
                }}
                required min="1000"
              />
            </div>
          )}

          {createCard.isError && (
            <p style={{ color: '#ef4444', fontSize: '13px' }}>
              {createCard.error?.response?.data?.message || 'Failed to create card'}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={createCard.isPending}>
              {createCard.isPending ? 'Applying...' : 'Apply for Card'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
