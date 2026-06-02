import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/emotionTags'
import { useAuth } from '../../context/AuthContext'
import { formatWallet } from '../../utils/format'

export default function DashboardSummary({ recordCount }) {
  const { isAuthenticated, walletAddress } = useAuth()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
      <div className="bg-ledger-paper border border-outline-variant/30 p-stack-md rounded-lg flex flex-col gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant">활성 레저</span>
        <div className="flex items-baseline gap-2">
          <span className="font-headline-lg text-headline-lg text-primary">{recordCount}</span>
          <span className="text-integrity-green font-label-caps text-[10px] bg-integrity-green/10 px-2 py-0.5 rounded">
            기록 보존 중
          </span>
        </div>
      </div>
      <div className="bg-ledger-paper border border-outline-variant/30 p-stack-md rounded-lg flex flex-col gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant">감정 기록</span>
        <p className="font-body-md text-on-surface-variant text-sm">
          사건과 입장을 분리해 안전하게 보관합니다.
        </p>
      </div>
      <div className="bg-ledger-paper border border-outline-variant/30 p-stack-md rounded-lg flex flex-col gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant">지갑 상태</span>
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-integrity-green" />
              <span className="font-mono-sm text-mono-sm text-hash-blue">
                {formatWallet(walletAddress)}
              </span>
            </div>
            <span className="font-body-md text-xs text-on-surface-variant">연결됨</span>
          </>
        ) : (
          <Link
            to={ROUTES.login}
            className="text-primary font-label-caps text-label-caps underline mt-1"
          >
            지갑 연결하기
          </Link>
        )}
      </div>
    </div>
  )
}
