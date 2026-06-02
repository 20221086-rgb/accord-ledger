import { getStoredToken } from '../utils/authStorage'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message)
    this.code = code
    this.status = status
  }
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok || body.success === false) {
    const err = body.error || {}
    throw new ApiError(
      err.code || 'REQUEST_FAILED',
      err.message || response.statusText || 'Request failed',
      response.status,
    )
  }
  return body.data
}
