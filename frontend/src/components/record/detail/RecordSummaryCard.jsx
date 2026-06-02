import Icon from '../../common/Icon'
import EmotionPill from './EmotionPill'
import HashBadge from './HashBadge'
import { formatWallet } from '../../../utils/format'

export default function RecordSummaryCard({ record }) {
  return (
    <article className="mb-10 rounded-2xl border border-outline-variant/50 bg-ledger-paper p-6 shadow-[0_4px_24px_rgba(101,94,72,0.08)] md:p-8">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="description" size="20px" />
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
              Record Summary
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md text-primary">{record.title}</h2>
        </div>
        {record.record_hash && <HashBadge hash={record.record_hash} />}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5">
          <Icon name="calendar_month" size="16px" />
          {record.created_at?.slice(0, 10)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5 font-mono text-xs text-hash-blue">
          <Icon name="account_balance_wallet" size="16px" />
          {formatWallet(record.creator_wallet)}
        </span>
        {record.emotion_tags && <EmotionPill label={record.emotion_tags} />}
      </div>

      <div className="rounded-xl border border-outline-variant/40 border-l-4 border-l-secondary bg-surface-container-low/80 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          상황 설명
        </p>
        <p className="whitespace-pre-wrap text-base leading-relaxed text-on-surface">
          {record.situation}
        </p>
      </div>
    </article>
  )
}
