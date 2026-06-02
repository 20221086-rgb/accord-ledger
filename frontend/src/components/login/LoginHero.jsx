import Icon from '../common/Icon'

export default function LoginHero() {
  return (
    <section className="flex flex-col gap-stack-lg">
      <div className="space-y-stack-sm">
        <span className="inline-flex items-center gap-2 font-label-caps text-label-caps text-secondary uppercase tracking-widest">
          <Icon name="verified" size="16px" />
          Immutable Relationship Protocol
        </span>
        <h1 className="font-display-lg text-display-lg text-ink-charcoal leading-tight">
          갈등은 사라져도,
          <br />
          기록은 남습니다.
        </h1>
      </div>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
        AccordLedger는 갈등 상황에서의 사건과 입장을 수정 없이 기록하는 관계 Ledger입니다.
        객관적 사실과 주관적 관점을 체계적으로 아카이빙하여 투명한 신뢰의 토대를 마련합니다.
      </p>
      <div className="flex flex-col gap-4 border-l-2 border-secondary pl-gutter py-2 mt-4">
        <div className="flex items-start gap-3">
          <Icon name="lock" className="text-primary mt-1" />
          <div>
            <p className="font-label-caps text-label-caps text-primary uppercase">Append Only</p>
            <p className="font-body-md text-on-surface-variant">
              한 번 기록된 내용은 수정되지 않으며, 새 입장으로만 정정할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="history" className="text-primary mt-1" />
          <div>
            <p className="font-label-caps text-label-caps text-primary uppercase">
              Timeline Archiving
            </p>
            <p className="font-body-md text-on-surface-variant">
              시간의 흐름에 따른 입장 변화를 타임라인으로 추적할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
