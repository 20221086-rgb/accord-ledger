import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiError } from '../api/client'
import {
  fetchCurrentUser,
  fetchLoginMessage,
  loginWithMetaMask,
} from '../api/auth'
import {
  clearAuthStorage,
  getStoredToken,
  getStoredWallet,
  persistAuthStorage,
} from '../utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [walletAddress, setWalletAddress] = useState(() => getStoredWallet())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getStoredToken()))
  const [error, setError] = useState(null)

  const persistSession = useCallback((nextToken, nextWallet) => {
    setToken(nextToken)
    setWalletAddress(nextWallet)
    persistAuthStorage(nextToken, nextWallet)
  }, [])

  const clearSession = useCallback(() => {
    clearAuthStorage()
    setToken(null)
    setWalletAddress(null)
    setUser(null)
    setLoading(false)
    setError(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!getStoredToken()) {
      setLoading(false)
      return
    }
    try {
      const data = await fetchCurrentUser()
      setUser(data)
      setError(null)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearSession()
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [clearSession])

  useEffect(() => {
    refreshUser()
  }, [refreshUser, token])

  const loginWithWallet = useCallback(async () => {
    setError(null)
    if (!window.ethereum) {
      throw new Error('MetaMask가 설치되어 있지 않습니다.')
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const address = accounts?.[0]
    if (!address) {
      throw new Error('MetaMask 지갑 주소를 가져오지 못했습니다.')
    }

    const loginPayload = await fetchLoginMessage(address)
    const message = loginPayload?.message
    if (!message) {
      throw new Error('서버에서 로그인 메시지를 받지 못했습니다.')
    }

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    })
    if (!signature) {
      throw new Error('MetaMask 서명이 취소되었거나 비어 있습니다.')
    }

    const data = await loginWithMetaMask(address, signature, message)
    if (!data?.token || !data?.wallet_address) {
      throw new Error('로그인 응답이 올바르지 않습니다.')
    }
    persistSession(data.token, data.wallet_address)
    await refreshUser()
    return data
  }, [persistSession, refreshUser])

  const loginWithDevTest = useCallback(async () => {
    setError(null)
    const address =
      walletAddress || '0x1234567890123456789012345678901234567890'
    const loginPayload = await fetchLoginMessage(address)
    const message = loginPayload?.message
    if (!message) {
      throw new Error('서버에서 로그인 메시지를 받지 못했습니다.')
    }

    const data = await loginWithMetaMask(address, 'test-signature', message)
    if (!data?.token || !data?.wallet_address) {
      throw new Error('로그인 응답이 올바르지 않습니다.')
    }
    persistSession(data.token, data.wallet_address)
    await refreshUser()
    return data
  }, [persistSession, refreshUser, walletAddress])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({
      token,
      walletAddress,
      user,
      loading,
      error,
      isAuthenticated: Boolean(token),
      loginWithWallet,
      loginWithDevTest,
      logout,
      clearSession,
      setError,
    }),
    [
      token,
      walletAddress,
      user,
      loading,
      error,
      loginWithWallet,
      loginWithDevTest,
      logout,
      clearSession,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
