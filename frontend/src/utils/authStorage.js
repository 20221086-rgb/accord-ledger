export const TOKEN_KEY = 'token'
export const WALLET_KEY = 'wallet_address'

export const AUTH_STORAGE_KEYS = [TOKEN_KEY, WALLET_KEY]

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredWallet() {
  return localStorage.getItem(WALLET_KEY)
}

export function persistAuthStorage(token, walletAddress) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(WALLET_KEY, walletAddress)
}

export function clearAuthStorage() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })
}
