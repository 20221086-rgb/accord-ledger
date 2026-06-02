const API_BASE = (process.env.VITE_API_URL || 'https://accord-ledger-2.onrender.com').replace(
  /\/$/,
  '',
)

const ORIGIN = 'https://accord-ledger.vercel.app'
const WALLET = '0x1234567890123456789012345678901234567890'

async function check(label, url, init = {}) {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(120_000) })
    const text = await res.text()
    let body
    try {
      body = JSON.parse(text)
    } catch {
      body = text.slice(0, 200)
    }
    const acao = res.headers.get('access-control-allow-origin')
    console.log(`\n[${label}] ${res.status} ACAO=${acao ?? '(none)'}`)
    console.log(JSON.stringify(body, null, 2))
    return res.ok
  } catch (err) {
    console.error(`\n[${label}] FAIL:`, err.message)
    return false
  }
}

console.log('API_BASE:', API_BASE)
console.log('Origin:', ORIGIN)

const healthOk = await check('health', `${API_BASE}/api/health`, {
  headers: { Origin: ORIGIN },
})

const loginOk = await check(
  'login-message',
  `${API_BASE}/auth/login-message?wallet_address=${WALLET}`,
  { headers: { Origin: ORIGIN } },
)

const corsOk = await check('cors-preflight', `${API_BASE}/api/health`, {
  method: 'OPTIONS',
  headers: {
    Origin: ORIGIN,
    'Access-Control-Request-Method': 'GET',
  },
})

console.log('\n--- summary ---')
console.log('health:', healthOk ? 'OK' : 'FAIL')
console.log('login-message:', loginOk ? 'OK' : 'FAIL')
console.log('cors:', corsOk ? 'OK' : 'FAIL')
process.exit(healthOk && loginOk ? 0 : 1)
