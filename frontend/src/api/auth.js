import { apiRequest } from './client'

export async function fetchLoginMessage(walletAddress) {
  const params = new URLSearchParams({ wallet_address: walletAddress })
  return apiRequest(`/auth/login-message?${params}`)
}

export async function loginWithMetaMask(walletAddress, signature, message) {
  return apiRequest('/auth/metamask/login', {
    method: 'POST',
    body: JSON.stringify({ wallet_address: walletAddress, signature, message }),
  })
}

export async function fetchCurrentUser() {
  return apiRequest('/auth/me')
}
