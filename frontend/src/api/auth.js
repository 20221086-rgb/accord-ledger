import { ApiError, apiRequest } from './client'

export async function fetchLoginMessage(walletAddress) {
  const params = new URLSearchParams({ wallet_address: walletAddress })
  const data = await apiRequest(`/auth/login-message?${params}`)
  const message = typeof data?.message === 'string' ? data.message.trim() : ''
  if (!message) {
    throw new ApiError(
      'INVALID_RESPONSE',
      '로그인 메시지를 받지 못했습니다.',
      502,
    )
  }
  return { message }
}

export async function loginWithMetaMask(walletAddress, signature, message) {
  const data = await apiRequest('/auth/metamask/login', {
    method: 'POST',
    body: JSON.stringify({ wallet_address: walletAddress, signature, message }),
  })
  const token = typeof data?.token === 'string' ? data.token : ''
  const wallet = typeof data?.wallet_address === 'string' ? data.wallet_address : ''
  if (!token || !wallet) {
    throw new ApiError(
      'INVALID_RESPONSE',
      '로그인 응답에 토큰 또는 지갑 주소가 없습니다.',
      502,
    )
  }
  return {
    token,
    wallet_address: wallet,
    expires_in: data.expires_in,
    login_message: data.login_message,
  }
}

export async function fetchCurrentUser() {
  const data = await apiRequest('/auth/me')
  if (!data?.wallet_address) {
    throw new ApiError(
      'INVALID_RESPONSE',
      '사용자 정보를 받지 못했습니다.',
      502,
    )
  }
  return data
}
