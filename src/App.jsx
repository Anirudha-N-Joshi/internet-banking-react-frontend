import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transfer from './pages/Transfer'
import Transactions from './pages/Transactions'
import Cards from './pages/Cards'
import Beneficiaries from './pages/Beneficiaries'
import Statement from './pages/Statement'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAccounts from './pages/admin/AdminAccounts'
import AdminTransactions from './pages/admin/AdminTransactions'

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

      <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/accounts"      element={<PrivateRoute><Accounts /></PrivateRoute>} />
      <Route path="/transfer"      element={<PrivateRoute><Transfer /></PrivateRoute>} />
      <Route path="/transactions"  element={<PrivateRoute><Transactions /></PrivateRoute>} />
      <Route path="/cards"         element={<PrivateRoute><Cards /></PrivateRoute>} />
      <Route path="/beneficiaries" element={<PrivateRoute><Beneficiaries /></PrivateRoute>} />
      <Route path="/statement"     element={<PrivateRoute><Statement /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/accounts" element={<AdminRoute><AdminAccounts /></AdminRoute>} />
      <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
    </Routes>
  )
}
