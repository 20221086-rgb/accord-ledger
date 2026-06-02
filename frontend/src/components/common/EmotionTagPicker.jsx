import { useState } from 'react'
import {
  EMOTION_TAG_GROUPS,
  MAX_EMOTION_TAGS,
} from '../../constants/emotionTags'
import { parseEmotionTags, toggleEmotionTag } from '../../utils/emotionTagUtils'

export default function EmotionTagPicker({ value, onChange }) {
  const selected = parseEmotionTags(value)
  const [limitMessage, setLimitMessage] = useState('')

  const handleSelect = (tag) => {
    const { tags, limitReached } = toggleEmotionTag(selected, tag, MAX_EMOTION_TAGS)
    if (limitReached) {
      setLimitMessage(`감정 태그는 최대 ${MAX_EMOTION_TAGS}개까지 선택할 수 있습니다.`)
      return
    }
    setLimitMessage('')
    onChange(tags)
  }

  const atLimit = selected.length >= MAX_EMOTION_TAGS

  return (
    <div className="space-y-stack-md" role="group" aria-label="감정 태그 선택">
      {EMOTION_TAG_GROUPS.map((group) => (
        <div key={group.label} className="space-y-2">
          <p className="font-label-caps text-[10px] uppercase tracking-wide text-on-surface-variant">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => {
              const normalized = tag.replace(/^#/, '')
              const active = selected.includes(normalized)
              const disabled = !active && atLimit

              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => handleSelect(tag)}
                  className={`stitch-chip ${
                    active
                      ? 'stitch-chip-active'
                      : disabled
                        ? 'stitch-chip-inactive opacity-40 cursor-not-allowed'
                        : 'stitch-chip-inactive'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="space-y-1 pt-1">
        <p className="text-xs text-on-surface-variant">
          {selected.length > 0 ? (
            <>
              선택됨 ({selected.length}/{MAX_EMOTION_TAGS}):{' '}
              {selected.map((tag) => `#${tag}`).join(', ')}
            </>
          ) : (
            <>선택하지 않아도 기록할 수 있습니다. (최대 {MAX_EMOTION_TAGS}개)</>
          )}
        </p>
        {limitMessage && (
          <p className="text-xs text-correction-amber" role="status">
            {limitMessage}
          </p>
        )}
      </div>
    </div>
  )
}
