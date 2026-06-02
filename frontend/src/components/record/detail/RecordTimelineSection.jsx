import RecordTimelineCard from './RecordTimelineCard'

export default function RecordTimelineSection({ perspectives }) {
  return (
    <section className="mb-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary">입장 타임라인</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            내 입장 · 상대 입장 · 정정 기록이 시간순으로 연결됩니다.
          </p>
        </div>
        <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
          {perspectives.length}개
        </span>
      </div>

      {perspectives.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-low/50 p-8 text-center">
          <p className="text-sm text-on-surface-variant">아직 추가된 입장이 없습니다.</p>
          <p className="mt-1 text-xs text-on-surface-variant">
            로그인 후 입장을 추가해 타임라인을 시작하세요.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/30 p-4 md:p-6">
          {perspectives.map((item, index) => (
            <RecordTimelineCard
              key={item.id}
              perspective={item}
              isLast={index === perspectives.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  )
}
