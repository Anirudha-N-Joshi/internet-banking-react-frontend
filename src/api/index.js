import api from './axiosInstance'

export const adminAPI = {
    getStats: () => api.get('/api/v1/admin/stats'),
    getAllUsers: () => api.get('/api/v1/admin/users'),
    getAllAccounts: () => api.get('/api/v1/admin/accounts'),
    getAllTransactions: () => api.get('/api/v1/admin/transactions'),
    updateUserStatus: (id, status) => api.put(`/api/v1/admin/users/${id}/status`, null, { params: { status } }),
    deleteUser: (id) => api.delete(`/api/v1/admin/users/${id}`),
    updateAccountStatus: (id, status) => api.put(`/api/v1/admin/accounts/${id}/status`, null, { params: { status } }),
}

export const authAPI = {
    login: (email, password) => api.post('/api/v1/authentication/login', { email, password }),
    register: (data) => api.post('/api/v1/authentication/register', data),
}

export const usersAPI = {
    getCurrentUser: (userId) => api.get(`/api/v1/users/currentUser`, { params: { userId } }),
    update: (userId, data) => api.put(`/api/v1/users/${userId}`, data),
    delete: (userId) => api.delete(`/api/v1/users/${userId}`),
}

export const accountsAPI = {
    getByUser: (userId) => api.get(`/api/v1/accounts/user/${userId}`),

    getByNumber: (accountNumber) => api.get(`/api/v1/accounts/${accountNumber}`),

    lookup: (accountNumber) => api.get(`/api/v1/accounts/${accountNumber}/lookup`),

    create: (data) => api.post('/api/v1/accounts/create', data),

    getStatement: (accountId, from, to) =>
        api.get(`/api/v1/transactions/${accountId}/statement`, {
            params: { from, to },
            responseType: 'blob',
        }),

    delete: (accountId) => api.delete(`/api/v1/accounts/${accountId}`),
}

export const transactionsAPI = {
    transfer: (data) => api.post('/api/v1/transactions/transfer', data),

    getAll: (accountId) => api.get(`/api/v1/transactions/account/${accountId}`),

    getOutgoing: (accountId) => api.get(`/api/v1/transactions/outgoing/${accountId}`),

    getIncoming: (accountId) => api.get(`/api/v1/transactions/incoming/${accountId}`),
}

export const cardsAPI = {
    getAll: () => api.get('/api/v1/cards/user'),

    create: (data) => api.post('/api/v1/cards/create', data),

    updateStatus: (cardId, status) => api.put(`/api/v1/cards/${cardId}/status`, { status }),

    delete: (cardId) => api.delete(`/api/v1/cards/${cardId}`),
}

export const beneficiariesAPI = {
    getAll: () => api.get('/api/v1/beneficiaries/user'),

    add: (data) => api.post('/api/v1/beneficiaries/add', data),

    update: (beneficiaryId, data) => api.put(`/api/v1/beneficiaries/${beneficiaryId}`, data),

    delete: (beneficiaryId) => api.delete(`/api/v1/beneficiaries/${beneficiaryId}`),
}
