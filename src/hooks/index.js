import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsAPI, transactionsAPI, cardsAPI, beneficiariesAPI } from '../api'

export const useAccounts = (userId) =>
  useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => accountsAPI.getByUser(userId).then(r => r.data),
    enabled: !!userId,
  })

export const useCreateAccount = () => {
  const queryClient = useQueryClient()
  // useMutation is for POST/PUT/DELETE — actions that change data
  return useMutation({
    mutationFn: (data) => accountsAPI.create(data).then(r => r.data),
    onSuccess: () => {
      // After creating, invalidate the cache so the list re-fetches automatically
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (accountId) => accountsAPI.delete(accountId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  })
}

export const useTransactions = (accountId) =>
  useQuery({
    queryKey: ['transactions', accountId],
    queryFn: () => transactionsAPI.getAll(accountId).then(r => r.data),
    enabled: !!accountId,
  })

export const useTransfer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => transactionsAPI.transfer(data).then(r => r.data),
    onSuccess: () => {
      // Refresh both accounts and transactions after a transfer
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export const useCards = () =>
  useQuery({
    queryKey: ['cards'],
    queryFn: () => cardsAPI.getAll().then(r => r.data),
  })

export const useCreateCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => cardsAPI.create(data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  })
}

export const useUpdateCardStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, status }) => cardsAPI.updateStatus(cardId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  })
}

export const useDeleteCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cardId) => cardsAPI.delete(cardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  })
}

export const useBeneficiaries = () =>
  useQuery({
    queryKey: ['beneficiaries'],
    queryFn: () => beneficiariesAPI.getAll().then(r => r.data),
  })

export const useAddBeneficiary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => beneficiariesAPI.add(data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beneficiaries'] }),
  })
}

export const useUpdateBeneficiary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ beneficiaryId, data }) => beneficiariesAPI.update(beneficiaryId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beneficiaries'] }),
  })
}

export const useDeleteBeneficiary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (beneficiaryId) => beneficiariesAPI.delete(beneficiaryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beneficiaries'] }),
  })
}
