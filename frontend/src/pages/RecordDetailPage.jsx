import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import PageCanvas from '../components/layout/PageCanvas'
import IntegrityPanel from '../components/integrity/IntegrityPanel'
import AddPerspectiveModal from '../components/perspective/AddPerspectiveModal'
import TimelineItem, { RecordTimelineHeader } from '../components/record/TimelineItem'
import TimelineSpine from '../components/record/TimelineSpine'
import { ROUTES } from '../constants/emotionTags'
import { fetchRecordDetail } from '../api/records'
import { useAuth } from '../context/AuthContext'

export default function RecordDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [record, setRecord] = useState(null)
  const [perspectives, setPerspectives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const loadDetail = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRecordDetail(id)
      setRecord(data.record)
      setPerspectives(data.perspectives || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  if (loading) {
    return (
      <PageCanvas className="max-w-3xl">
        <p className="text-on-surface-variant font-body-md">로딩 중...</p>
      </PageCanvas>
    )
  }

  if (error || !record) {
    return (
      <PageCanvas className="max-w-3xl">
        <p className="text-error font-body-md">{error || 'Record를 찾을 수 없습니다.'}</p>
        <Link
          to={ROUTES.home}
          className="mt-stack-md inline-flex items-center gap-1 font-label-caps text-label-caps text-primary hover:underline"
        >
          <Icon name="arrow_back" size="18px" />
          대시보드
        </Link>
      </PageCanvas>
    )
  }

  return (
    <PageCanvas className="max-w-3xl pb-stack-lg">
      <nav className="mb-stack-lg" aria-label="페이지 이동">
        <Link
          to={ROUTES.home}
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5 transition-colors"
        >
          <Icon name="arrow_back" size="18px" />
          대시보드
        </Link>
      </nav>

      <div className="relative">
        <TimelineSpine />

        <RecordTimelineHeader record={record} />

        {perspectives.length > 0 ? (
          perspectives.map((item) => <TimelineItem key={item.id} perspective={item} />)
        ) : (
          <section className="relative mb-stack-lg pl-timeline-indent">
            <div className="stitch-card text-center">
              <p className="font-body-md text-on-surface-variant">아직 추가된 입장이 없습니다.</p>
              {isAuthenticated && (
                <p className="mt-1 text-sm text-on-surface-variant">
                  아래 버튼으로 첫 입장을 남겨 타임라인을 시작하세요.
                </p>
              )}
            </div>
          </section>
        )}

        {isAuthenticated && (
          <div className="flex gap-gutter mt-stack-lg pl-timeline-indent mb-stack-lg">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-primary text-ledger-paper px-gutter py-3 rounded-lg font-label-caps text-label-caps shadow-md hover:opacity-90 active:scale-95 transition"
            >
              <Icon name="add_box" size="20px" />
              입장 추가
            </button>
          </div>
        )}

        <div className="pl-timeline-indent">
          <IntegrityPanel recordId={id} />
        </div>
      </div>

      {showModal && (
        <AddPerspectiveModal
          recordId={id}
          onClose={() => setShowModal(false)}
          onAdded={loadDetail}
        />
      )}
    </PageCanvas>
  )
}
