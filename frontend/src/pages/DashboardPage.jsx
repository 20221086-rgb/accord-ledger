import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/common/Icon'
import PageCanvas from '../components/layout/PageCanvas'
import DashboardSummary from '../components/record/DashboardSummary'
import RecordCard from '../components/record/RecordCard'
import TimelineSpine from '../components/record/TimelineSpine'
import { ROUTES } from '../constants/emotionTags'
import { fetchRecords } from '../api/records'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { isAuthenticated, walletAddress } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchRecords({
          creatorWallet: isAuthenticated ? walletAddress : undefined,
        })
        if (!cancelled) {
          setRecords(data.records || [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, walletAddress])

  return (
    <PageCanvas>
      <DashboardSummary recordCount={records.length} />

      {loading && <p className="text-on-surface-variant">로딩 중...</p>}
      {error && <p className="text-error">{error}</p>}

      <div className="relative">
        <TimelineSpine />
        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-md relative z-10 bg-background inline-block pr-4">
          최근 갈등 사건 기록
        </h3>

        {!loading && !error && records.length === 0 && (
          <div className="relative pl-timeline-indent bg-ledger-paper border border-outline-variant/30 rounded-lg p-gutter text-center">
            <p className="text-on-surface-variant">아직 Record가 없습니다.</p>
            {isAuthenticated ? (
              <Link
                to={ROUTES.recordNew}
                className="mt-4 inline-flex items-center gap-2 bg-primary text-ledger-paper px-6 py-2 rounded-lg font-label-caps text-label-caps"
              >
                <Icon name="add" size="18px" />
                첫 Record 만들기
              </Link>
            ) : (
              <Link
                to={ROUTES.login}
                className="mt-4 inline-block text-primary underline font-label-caps text-label-caps"
              >
                로그인하기
              </Link>
            )}
          </div>
        )}

        <div className="space-y-stack-md">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      </div>
    </PageCanvas>
  )
}
