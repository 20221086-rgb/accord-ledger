import Icon from './Icon'

export default function AppendOnlyNotice({ className = '' }) {
  return (
    <div
      className={`flex items-start gap-3 p-4 bg-surface-container rounded-lg border-l-4 border-correction-amber ${className}`}
    >
      <Icon name="info" className="text-correction-amber shrink-0" />
      <p className="text-sm text-on-surface-variant">
        <span className="font-bold">Append-Only:</span> 저장 후 수정·삭제할 수 없습니다.
        필요하면 Record 상세에서 새 입장을 추가하세요.
      </p>
    </div>
  )
}
