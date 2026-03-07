export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const maskAccount = (accountNumber) => {
  if (!accountNumber) return ''
  return '••••' + accountNumber.slice(-4)
}

export const getStatusBadge = (status) => {
  const map = {
    ACTIVE: 'badge-success',
    SUCCESS: 'badge-success',
    COMPLETED: 'badge-success',
    INACTIVE: 'badge-gray',
    PENDING: 'badge-warning',
    BLOCKED: 'badge-danger',
    FAILED: 'badge-danger',
    CLOSED: 'badge-gray',
    CANCELLED: 'badge-gray',
    SUSPENDED: 'badge-warning',
    EXPIRED: 'badge-gray',
  }
  return map[status] || 'badge-gray'
}

export const downloadPDF = (blob, filename = 'statement.pdf') => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export const truncate = (text, length = 30) => {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}
