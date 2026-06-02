import { Link } from 'react-router-dom'
import Icon from '../common/Icon'
import AppendOnlyNotice from '../common/AppendOnlyNotice'
import EmotionTagPicker from '../common/EmotionTagPicker'
import TimelineSpine from './TimelineSpine'
import { ROUTES } from '../../constants/emotionTags'

export default function CreateRecordForm({
  title,
  situation,
  emotionTags,
  error,
  submitting,
  onTitleChange,
  onSituationChange,
  onEmotionTagsChange,
  onSubmit,
}) {
  return (
    <div className="max-w-3xl w-full relative">
      <TimelineSpine />

      <header className="mb-stack-lg relative z-10 pl-timeline-indent">
        <div className="absolute left-[19px] md:left-[43px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />
        <h1 className="font-display-lg text-display-lg text-primary">갈등 기록 시작하기</h1>
        <p className="font-body-md text-on-surface-variant mt-2">
          객관적 사실과 주관적 입장의 분리 기록을 통해 보존합니다.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="stitch-card relative z-10 mb-12 ml-0 pl-timeline-indent space-y-stack-lg"
      >
        <section className="space-y-stack-sm">
          <label htmlFor="record-title" className="block font-label-caps text-label-caps text-primary">
            어떤 갈등이 있었나요?
          </label>
          <input
            id="record-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={200}
            placeholder="예: 거실 청소 분담에 관한 의견 차이"
            className="stitch-input"
          />
          <p className="text-xs text-on-surface-variant">{title.length} / 200</p>
        </section>

        <section className="space-y-stack-sm">
          <label htmlFor="record-situation" className="block font-label-caps text-label-caps text-primary">
            감정보다 먼저, 실제로 있었던 일을 기록해주세요.
          </label>
          <p className="text-xs text-on-surface-variant italic">
            언제, 어떤 일이 있었나요? 사실 위주로 작성하세요.
          </p>
          <textarea
            id="record-situation"
            value={situation}
            onChange={(e) => onSituationChange(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="언제, 어떤 일이 있었나요?"
            className="stitch-input"
          />
          <p className="text-xs text-on-surface-variant">
            {situation.length} / 2000 (최소 10자)
          </p>
        </section>

        <section className="space-y-stack-sm relative z-10">
          <span className="block font-label-caps text-label-caps text-on-surface-variant">
            정서적 지표 (선택)
          </span>
          <EmotionTagPicker value={emotionTags} onChange={onEmotionTagsChange} />
        </section>

        <AppendOnlyNotice />

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <Link
            to={ROUTES.home}
            className="px-6 py-3 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-low transition"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-ledger-paper rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 disabled:opacity-60 shadow-md transition"
          >
            <Icon name="lock_reset" size="20px" />
            {submitting ? '저장 중...' : '기록 저장하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
