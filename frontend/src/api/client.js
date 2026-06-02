import { getStoredToken } from '../utils/authStorage'

function resolveApiBase() {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return ''
  return raw.replace(/\/$/, '')
}

const API_BASE = resolveApiBase()

function buildUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message)
    this.code = code
    this.status = status
  }
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const headers = { ...(options.headers || {}) }
  const hasBody = options.body != null && options.body !== ''
  if (hasBody || (method !== 'GET' && method !== 'HEAD')) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }
  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers,
    })
  } catch {
    throw new ApiError(
      'NETWORK_ERROR',
      'API 서버에 연결할 수 없습니다. 백엔드 실행 및 VITE_API_URL 설정을 확인해주세요.',
      0,
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : null

  if (body === null) {
    throw new ApiError(
      'INVALID_RESPONSE',
      response.ok
        ? '서버 응답 형식이 올바르지 않습니다.'
        : response.statusText || 'Request failed',
      response.status,
    )
  }

  if (!response.ok || body.success === false) {
    const err = body.error || {}
    throw new ApiError(
      err.code || 'REQUEST_FAILED',
      err.message || response.statusText || 'Request failed',
      response.status,
    )
  }

  if (body.data === undefined || body.data === null) {
    throw new ApiError(
      'INVALID_RESPONSE',
      body.message || '서버가 비어 있는 응답을 반환했습니다.',
      response.status,
    )
  }

  return body.data
}
