import { Link } from 'react-router-dom'
import Icon from '../common/Icon'
import EmotionTag from '../common/EmotionTag'
import { ROUTES } from '../../constants/emotionTags'
import { perspectiveCount } from '../../utils/format'

export default function RecordCard({ record }) {
  const count = perspectiveCount(record)

  return (
    <div className="relative pl-timeline-indent">
      <div className="absolute left-[19px] md:left-[43px] top-6 w-3 h-3 rounded-full bg-primary z-10" />
      <article className="stitch-card hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-stack-sm">
          <div>
            <h4 className="font-headline-md text-headline-md text-primary">{record.title}</h4>
            <p className="font-body-md text-on-surface-variant max-w-2xl mt-1 line-clamp-2">
              {record.situation}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="font-label-caps text-label-caps text-on-surface-variant block">
              {record.created_at?.slice(0, 10)}
            </span>
            <span className="font-label-caps text-label-caps text-integrity-green bg-integrity-green/5 px-2 py-0.5 rounded mt-2 inline-block">
              해시 보존
            </span>
          </div>
        </div>
        {record.emotion_tags && <EmotionTag label={record.emotion_tags} className="mt-2" />}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-outline-variant/20">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            입장 {count}개
          </span>
          <Link
            to={ROUTES.recordDetail(record.id)}
            className="text-primary hover:underline font-label-caps text-label-caps flex items-center gap-1"
          >
            상세 보기
            <Icon name="chevron_right" size="18px" />
          </Link>
        </div>
      </article>
    </div>
  )
}
