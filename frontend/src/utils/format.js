export function shortHash(value) {
  if (!value) return ''
  return value.length > 20 ? `${value.slice(0, 10)}...${value.slice(-10)}` : value
}

export function perspectiveCount(record) {
  const count = record?.perspectives_count
  return typeof count === 'number' ? count : 0
}

export function formatWallet(wallet) {
  if (!wallet) return ''
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
}
