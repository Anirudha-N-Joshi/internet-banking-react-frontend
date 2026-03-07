import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'
import { usersAPI } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await usersAPI.getCurrentUser(user?.userId)
        const u = res.data
        setForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          userName: u.userName || "",
          email: u.email || "",
          phoneNumber: u.phoneNumber || "",
          address: u.address || "",
        });
      } catch (err) {
        setError('Failed to load profile data')
      } finally {
        setFetchLoading(false)
      }
    }
    if (user?.userId) fetchUser()
  }, [user?.userId])

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await usersAPI.update(user.userId, form)
      setSuccess('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await usersAPI.delete(user.userId)
      logout()
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account')
      setShowDeleteConfirm(false)
    }
    setDeleteLoading(false)
  }

  const handleCancelEdit = () => {
    setEditing(false);
    setError("");
    setForm((p) => ({ ...p, password: "" }));
  };

  const fields = [
    { name: 'firstName',   label: 'First Name',    type: 'text',  placeholder: 'John'              },
    { name: 'lastName',    label: 'Last Name',     type: 'text',  placeholder: 'Doe'               },
    { name: 'userName',    label: 'Username',      type: 'text',  placeholder: 'johndoe123'         },
    { name: 'email',       label: 'Email Address', type: 'email', placeholder: 'you@example.com'   },
    { name: 'phoneNumber', label: 'Phone Number',  type: 'tel',   placeholder: '+1 234 567 8900'   },
    { name: 'address',     label: 'Address',       type: 'text',  placeholder: '123 Main St, City' },
    { name: 'password',    label: 'New Password',  type: 'password', placeholder: 'Min 8 characters'  },

  ]

  if (fetchLoading) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading profile...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="animate-fadeInUp stagger-1" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your personal information</p>
        </div>

        {/* Avatar banner */}
        <div className="glass-card animate-fadeInUp stagger-2" style={{ padding: '28px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: '700', color: '#fff', flexShrink: 0,
          }}>
            {(form.firstName?.[0] || form.email?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>
              {form.firstName ? `${form.firstName} ${form.lastName}` : form.email}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>@{form.userName}</div>
            <div style={{
              display: 'inline-block', marginTop: '6px',
              padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
              background: user?.role === 'ADMIN' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
              color: user?.role === 'ADMIN' ? '#f59e0b' : '#3b82f6',
            }}>
              {user?.role}
            </div>
          </div>
          {!editing && (
            <button
              className="btn-secondary"
              onClick={() => setEditing(true)}
              style={{ width: 'auto', padding: '10px 20px', marginLeft: 'auto' }}
            >
              ✎ Edit Profile
            </button>
          )}
        </div>

        {/* Form card */}
        <div className="glass-card animate-fadeInUp stagger-3" style={{ padding: '32px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#ef4444', fontSize: '13px' }}>
              ⚠ {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#10b981', fontSize: '13px' }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* First + Last name side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {fields.slice(0, 2).map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    {f.label}
                  </label>
                  <input
                    name={f.name}
                    type={f.type}
                    className="input-field"
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={handleChange}
                    disabled={!editing}
                    style={{ opacity: editing ? 1 : 0.6, cursor: editing ? 'text' : 'not-allowed' }}
                  />
                </div>
              ))}
            </div>

            {/* All remaining fields — one per row */}
            {fields.slice(2).map(f => {
              if (f.name === 'password' && !editing) return null
              return (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    {f.label}
                    {f.name === 'password' && (
                      <span style={{ fontWeight: '400', marginLeft: '6px', color: 'var(--text-muted)' }}>
                        (leave blank to keep current)
                      </span>
                    )}
                  </label>
                  <input
                    name={f.name}
                    type={f.type}
                    className="input-field"
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={handleChange}
                    disabled={!editing}
                    minLength={f.name === 'password' ? 8 : undefined}
                    style={{ opacity: editing ? 1 : 0.6, cursor: editing ? 'text' : 'not-allowed' }}
                  />
                </div>
              )
            })}

            {editing && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Danger zone */}
        <div className="glass-card animate-fadeInUp stagger-4" style={{ padding: '28px', marginTop: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#ef4444' }}>Danger Zone</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)} style={{ width: 'auto', padding: '10px 20px' }}>
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Account" width="420px">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Are you absolutely sure?</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            This will permanently delete your account and all associated data.
            <strong style={{ color: 'var(--text-primary)' }}> This cannot be undone.</strong>
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            <button className="btn-danger" style={{ width: '100%' }} onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
