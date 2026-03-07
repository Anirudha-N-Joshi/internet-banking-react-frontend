import React, { useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import { useBeneficiaries, useAddBeneficiary, useDeleteBeneficiary, useUpdateBeneficiary } from '../hooks'
import { accountsAPI } from '../api'
import { formatDate } from '../utils/helpers'

export default function Beneficiaries() {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState({ accountNumber: '', nickName: '', bankName: '' })
  const [lookupResult, setLookupResult] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  const { data: beneficiaries = [], isLoading } = useBeneficiaries()
  const addBeneficiary = useAddBeneficiary()
  const updateBeneficiary = useUpdateBeneficiary()
  const deleteBeneficiary = useDeleteBeneficiary()

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleLookup = async () => {
    if (!form.accountNumber) return
    setLookupLoading(true)
    setLookupError('')
    setLookupResult('')
    try {
      const res = await accountsAPI.lookup(form.accountNumber)
      setLookupResult(res.data.accountHolderName || res.data)
    } catch {
      setLookupError('Account not found')
    }
    setLookupLoading(false)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    await addBeneficiary.mutateAsync({
      accountNumber: form.accountNumber,
      accountHolderName: lookupResult,
      nickName: form.nickName,
      bankName: form.bankName,
    })
    setShowAdd(false)
    setForm({ accountNumber: '', nickName: '', bankName: '' })
    setLookupResult('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    await updateBeneficiary.mutateAsync({
      beneficiaryId: editItem.id,
      data: { nickName: form.nickName, bankName: form.bankName, accountNumber: editItem.accountNumber },
    })
    setEditItem(null)
  }

  const handleDelete = async () => {
    await deleteBeneficiary.mutateAsync(deleteConfirm.id)
    setDeleteConfirm(null)
  }

  const initials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'
  const avatarColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

  return (
    <Layout>
      <div className="animate-fadeInUp stagger-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Beneficiaries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{beneficiaries.length} saved recipients</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '11px 22px' }} onClick={() => setShowAdd(true)}>
          + Add Recipient
        </button>
      </div>

      {isLoading ? <Spinner text="Loading..." /> : (
        <div className="animate-fadeInUp stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {beneficiaries.map((b, i) => (
            <div key={b.id} className="glass-card" style={{ padding: '24px', animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: avatarColors[i % avatarColors.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '700', flexShrink: 0,
                }}>
                  {initials(b.accountHolderName)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px', truncate: 'ellipsis' }}>{b.accountHolderName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '500' }}>{b.nickName}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'Account', value: b.accountNumber },
                  { label: 'Bank', value: b.bankName || 'NovaPay' },
                  { label: 'Added', value: formatDate(b.createdAt) },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.label}</span>
                    <span className="mono" style={{ fontSize: '12px' }}>{d.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '13px', padding: '9px 16px' }}
                  onClick={() => { setEditItem(b); setForm({ nickName: b.nickName, bankName: b.bankName || '' }) }}
                >
                  Edit
                </button>
                <button className="btn-danger" onClick={() => setDeleteConfirm(b)}>Remove</button>
              </div>
            </div>
          ))}

          {beneficiaries.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>👥</p>
              <p style={{ fontWeight: '600', marginBottom: '8px' }}>No saved recipients</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Add recipients for faster transfers</p>
            </div>
          )}
        </div>
      )}

      {/* Add Beneficiary Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setLookupResult(''); setLookupError('') }} title="Add Recipient">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Account Number
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                name="accountNumber"
                className="input-field"
                placeholder="Enter account number"
                value={form.accountNumber}
                onChange={(e) => { handleChange(e); setLookupResult(''); setLookupError('') }}
                required
              />
              <button type="button" className="btn-secondary" style={{ width: 'auto', padding: '12px 16px' }} onClick={handleLookup}>
                {lookupLoading ? '...' : 'Verify'}
              </button>
            </div>
            {lookupResult && <p style={{ color: '#10b981', fontSize: '13px', marginTop: '6px' }}>✓ {lookupResult}</p>}
            {lookupError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{lookupError}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Nickname <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>(e.g. "Dad", "Landlord")</span>
            </label>
            <input name="nickName" className="input-field" placeholder="Nickname" value={form.nickName} onChange={handleChange} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Bank Name <span style={{ fontWeight: '400' }}>(optional)</span>
            </label>
            <input name="bankName" className="input-field" placeholder="e.g. HDFC, SBI" value={form.bankName} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!lookupResult || addBeneficiary.isPending}>
              {addBeneficiary.isPending ? 'Saving...' : 'Save Recipient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Recipient" width="400px">
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Account Number
            </label>
            <input
              className="input-field mono"
              value={editItem?.accountNumber || ''}
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Nickname</label>
            <input name="nickName" className="input-field" value={form.nickName} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>Bank Name</label>
            <input name="bankName" className="input-field" value={form.bankName} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={updateBeneficiary.isPending}>
              {updateBeneficiary.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Remove Recipient" width="400px">
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          Remove <strong style={{ color: 'var(--text-primary)' }}>{deleteConfirm?.accountHolderName}</strong> from your saved recipients?
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn-danger" style={{ width: '100%' }} onClick={handleDelete} disabled={deleteBeneficiary.isPending}>
            {deleteBeneficiary.isPending ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </Modal>
    </Layout>
  )
}
