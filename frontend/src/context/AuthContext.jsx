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
    const address = accounts[0]
    const { message } = await fetchLoginMessage(address)
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    })
    const data = await loginWithMetaMask(address, signature, message)
    persistSession(data.token, data.wallet_address)
    await refreshUser()
    return data
  }, [persistSession, refreshUser])

  const loginWithDevTest = useCallback(async () => {
    setError(null)
    const address =
      walletAddress || '0x1234567890123456789012345678901234567890'
    const { message } = await fetchLoginMessage(address)
    const data = await loginWithMetaMask(address, 'test-signature', message)
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
