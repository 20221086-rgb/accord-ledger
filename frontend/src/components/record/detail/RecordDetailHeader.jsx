import { Link } from 'react-router-dom'
import Icon from '../../common/Icon'
import HashBadge from './HashBadge'
import { ROUTES } from '../../../constants/emotionTags'

export default function RecordDetailHeader({ recordHash }) {
  return (
    <header className="mb-8 space-y-4">
      <Link
        to={ROUTES.home}
        className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/60 bg-ledger-paper px-3 py-2 text-sm font-semibold uppercase tracking-wide text-on-surface-variant transition hover:border-secondary/40 hover:text-primary"
      >
        <Icon name="arrow_back" size="18px" />
        대시보드
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
            Record Detail
          </p>
          <h1 className="font-headline-lg text-headline-lg text-primary">기록 상세</h1>
          <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
            사건 요약과 입장 타임라인을 시간순으로 확인합니다. 기록은 수정할 수 없으며 새
            입장으로만 정정할 수 있습니다.
          </p>
        </div>
        {recordHash && (
          <div className="shrink-0">
            <HashBadge hash={recordHash} icon="lock" />
            <p className="mt-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-integrity-green">
              Hash Verified
            </p>
          </div>
        )}
      </div>
    </header>
  )
}
