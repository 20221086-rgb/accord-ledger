import { useState } from 'react'
import { addPerspective } from '../../api/records'
import Icon from '../common/Icon'

const TYPE_OPTIONS = [
  { value: 'me', label: '내 입장' },
  { value: 'other', label: '상대 입장' },
  { value: 'correction', label: '정정 기록' },
]

export default function AddPerspectiveModal({ recordId, onClose, onAdded }) {
  const [type, setType] = useState('me')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    if (content.trim().length < 10) {
      setError('입장 내용은 최소 10자 이상이어야 합니다.')
      return
    }
    setSubmitting(true)
    try {
      await addPerspective(recordId, { type, content: content.trim() })
      onAdded()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-charcoal/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-ledger-paper border border-outline-variant rounded-lg p-gutter shadow-2xl"
      >
        <div className="flex items-center justify-between mb-stack-md">
          <h3 className="font-headline-md text-headline-md text-primary">새 입장 추가</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary"
            aria-label="닫기"
          >
            <Icon name="close" />
          </button>
        </div>

        <p className="text-sm text-on-surface-variant mb-stack-md">
          기록은 수정할 수 없습니다. 새 입장으로만 정정할 수 있습니다.
        </p>

        <label className="block font-label-caps text-label-caps text-primary mb-1">유형</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md mb-stack-md focus:border-primary focus:ring-0"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="block font-label-caps text-label-caps text-primary mb-1">입장 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="최소 10자 이상 입력"
          className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md focus:border-primary focus:ring-0"
        />
        <p className="mt-1 text-xs text-on-surface-variant">{content.length} / 5000</p>

        {error && <p className="mt-3 text-sm text-error">{error}</p>}

        <div className="mt-stack-md flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-ledger-paper py-3 rounded-lg font-label-caps text-label-caps disabled:opacity-60"
          >
            <Icon name="add" size="18px" />
            {submitting ? '추가 중...' : '추가'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
