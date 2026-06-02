import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
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
      <p className="px-margin-mobile md:px-gutter py-stack-lg text-on-surface-variant">로딩 중...</p>
    )
  }

  if (error || !record) {
    return (
      <div className="px-margin-mobile md:px-gutter py-stack-lg">
        <p className="text-error">{error || 'Record를 찾을 수 없습니다.'}</p>
        <Link
          to={ROUTES.home}
          className="mt-4 inline-block text-primary underline font-label-caps text-label-caps"
        >
          대시보드로
        </Link>
      </div>
    )
  }

  return (
    <div className="px-margin-mobile md:px-gutter py-stack-lg max-w-3xl mx-auto relative pb-stack-lg">
      <TimelineSpine />

      <div className="mb-stack-md relative z-10">
        <Link
          to={ROUTES.home}
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
        >
          <Icon name="arrow_back" size="18px" />
          대시보드
        </Link>
      </div>

      <RecordTimelineHeader record={record} />

      {perspectives.map((item) => (
        <TimelineItem key={item.id} perspective={item} />
      ))}

      {isAuthenticated && (
        <div className="flex gap-gutter mt-stack-lg pl-timeline-indent mb-stack-lg">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-primary text-ledger-paper px-gutter py-3 rounded-lg font-label-caps text-label-caps shadow-md hover:opacity-90 active:scale-95 transition"
          >
            <Icon name="add_box" />
            입장 추가
          </button>
        </div>
      )}

      <div className="pl-timeline-indent">
        <IntegrityPanel recordId={id} />
      </div>

      {showModal && (
        <AddPerspectiveModal
          recordId={id}
          onClose={() => setShowModal(false)}
          onAdded={loadDetail}
        />
      )}
    </div>
  )
}
