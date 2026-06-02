import Icon from '../../common/Icon'
import HashBadge from './HashBadge'
import { PERSPECTIVE_TYPE_LABELS } from '../../../constants/emotionTags'

const TYPE_STYLES = {
  me: {
    icon: 'person_pin',
    dot: 'bg-primary',
    label: 'text-primary',
    border: 'border-outline-variant/50',
    card: 'bg-ledger-paper',
  },
  other: {
    icon: 'groups',
    dot: 'bg-primary',
    label: 'text-primary',
    border: 'border-outline-variant/50',
    card: 'bg-ledger-paper',
  },
  correction: {
    icon: 'edit_note',
    dot: 'bg-background border-2 border-correction-amber',
    label: 'text-correction-amber',
    border: 'border-correction-amber/35 border-dashed',
    card: 'bg-ledger-paper/90',
  },
}

function formatTimestamp(iso) {
  if (!iso) return ''
  return iso.slice(0, 16).replace('T', ' ')
}

export default function RecordTimelineCard({ perspective, isLast }) {
  const style = TYPE_STYLES[perspective.type] || TYPE_STYLES.me
  const label = PERSPECTIVE_TYPE_LABELS[perspective.type] || perspective.type

  return (
    <div className="flex gap-4 md:gap-6">
      <div className="flex w-6 shrink-0 flex-col items-center md:w-8">
        <div className={`mt-7 h-3 w-3 shrink-0 rounded-full ${style.dot}`} />
        {!isLast && <div className="mt-1 w-0.5 flex-1 min-h-[2rem] bg-secondary/25" />}
      </div>

      <div
        className={`mb-6 flex-1 rounded-2xl border p-5 shadow-[0_2px_16px_rgba(101,94,72,0.06)] md:p-6 ${style.border} ${style.card}`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Icon name={style.icon} size="20px" className={style.label} />
            <span className={`text-sm font-semibold uppercase tracking-wide ${style.label}`}>
              {label}
            </span>
          </div>
          <time className="text-xs font-medium text-on-surface-variant">
            {formatTimestamp(perspective.created_at)}
          </time>
        </div>

        <p className="whitespace-pre-wrap text-base leading-relaxed text-on-surface">
          {perspective.content}
        </p>

        {perspective.hash && (
          <div className="mt-4 pt-4 border-t border-outline-variant/30">
            <HashBadge hash={perspective.hash} icon="link" />
          </div>
        )}
      </div>
    </div>
  )
}
