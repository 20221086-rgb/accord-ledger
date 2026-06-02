export const MAX_EMOTION_TAGS = 5

export function normalizeEmotionTag(tag) {
  return (tag || '').replace(/^#/, '').trim()
}

export function parseEmotionTags(value) {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map(normalizeEmotionTag).filter(Boolean)
  }
  return String(value)
    .split(',')
    .map(normalizeEmotionTag)
    .filter(Boolean)
}

export function formatEmotionTagsForApi(tags) {
  const normalized = parseEmotionTags(tags)
  if (normalized.length === 0) return undefined
  return normalized.map((tag) => `#${tag}`).join(',')
}

export function toggleEmotionTag(selected, tag, max = MAX_EMOTION_TAGS) {
  const normalized = normalizeEmotionTag(tag)
  const current = parseEmotionTags(selected)

  if (current.includes(normalized)) {
    return { tags: current.filter((item) => item !== normalized), limitReached: false }
  }

  if (current.length >= max) {
    return { tags: current, limitReached: true }
  }

  return { tags: [...current, normalized], limitReached: false }
}
