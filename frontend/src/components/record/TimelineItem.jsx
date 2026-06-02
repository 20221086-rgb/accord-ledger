import Icon from '../common/Icon'
import EmotionTag from '../common/EmotionTag'
import { PERSPECTIVE_TYPE_LABELS } from '../../constants/emotionTags'
import { shortHash } from '../../utils/format'

const TYPE_ICONS = {
  me: 'person_pin',
  other: 'groups',
  correction: 'edit_note',
}

export function RecordTimelineHeader({ record }) {
  return (
    <section className="relative ledger-card pl-timeline-indent mb-stack-lg">
      <div className="stitch-card">
        <div className="flex justify-between items-start mb-stack-sm flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="lock" filled className="text-primary" />
            <span className="font-label-caps text-label-caps text-primary uppercase">Record</span>
          </div>
          {record.record_hash && (
            <span className="font-mono-sm text-mono-sm text-hash-blue bg-hash-blue/5 px-2 py-1 rounded flex items-center gap-1">
              <Icon name="verified" size="14px" />
              {shortHash(record.record_hash)}
            </span>
          )}
        </div>
        <h1 className="font-headline-md text-headline-md text-primary mb-2">{record.title}</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant">
          {record.created_at?.slice(0, 10)} · {record.creator_wallet?.slice(0, 6)}...
          {record.creator_wallet?.slice(-4)}
        </p>
        {record.emotion_tags && <EmotionTag label={record.emotion_tags} className="mt-3" />}
        <div className="mt-4 p-4 bg-surface-container-low rounded-lg border-l-4 border-primary">
          <p className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
            상황 설명
          </p>
          <p className="text-body-md leading-relaxed whitespace-pre-wrap">{record.situation}</p>
        </div>
      </div>
    </section>
  )
}

export default function TimelineItem({ perspective }) {
  const isCorrection = perspective.type === 'correction'
  const label = PERSPECTIVE_TYPE_LABELS[perspective.type] || perspective.type
  const iconName = TYPE_ICONS[perspective.type] || 'chat'

  return (
    <section
      className={`relative mb-stack-lg pl-timeline-indent ${isCorrection ? 'correction-card' : 'ledger-card'}`}
    >
      <div
        className={`stitch-card ${
          isCorrection ? 'border-correction-amber/30 border-dashed' : ''
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon
            name={iconName}
            className={isCorrection ? 'text-correction-amber' : 'text-primary'}
          />
          <span
            className={`font-label-caps text-label-caps uppercase ${
              isCorrection ? 'text-correction-amber' : 'text-primary'
            }`}
          >
            {label}
          </span>
          <span className="ml-auto font-label-caps text-label-caps text-on-surface-variant text-[10px]">
            {perspective.created_at?.slice(0, 16).replace('T', ' ')}
          </span>
        </div>
        <p className="text-body-md leading-relaxed whitespace-pre-wrap">{perspective.content}</p>
        {perspective.hash && (
          <p className="mt-3 font-mono-sm text-mono-sm text-hash-blue">
            Hash: {shortHash(perspective.hash)}
          </p>
        )}
      </div>
    </section>
  )
}
