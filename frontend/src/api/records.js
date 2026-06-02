import { apiRequest } from './client'

export async function fetchRecords({ page = 1, limit = 10, creatorWallet } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  if (creatorWallet) {
    params.set('creator_wallet', creatorWallet)
  }
  return apiRequest(`/records?${params}`)
}

export async function fetchRecordDetail(id) {
  return apiRequest(`/records/${id}`)
}

export async function createRecord(payload) {
  return apiRequest('/records', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function addPerspective(recordId, payload) {
  return apiRequest(`/records/${recordId}/perspectives`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function verifyRecord(id) {
  return apiRequest(`/records/${id}/verify`)
}
