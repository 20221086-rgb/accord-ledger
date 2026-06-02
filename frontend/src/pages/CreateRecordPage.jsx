import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageCanvas from '../components/layout/PageCanvas'
import CreateRecordForm from '../components/record/CreateRecordForm'
import { ROUTES, formatEmotionTagsForApi } from '../constants/emotionTags'
import { createRecord } from '../api/records'

export default function CreateRecordPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [situation, setSituation] = useState('')
  const [emotionTags, setEmotionTags] = useState([])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    if (title.trim().length < 5) {
      setError('제목은 5자 이상이어야 합니다.')
      return
    }
    if (situation.trim().length < 10) {
      setError('설명은 10자 이상이어야 합니다.')
      return
    }
    setSubmitting(true)
    try {
      const data = await createRecord({
        title: title.trim(),
        description: situation.trim(),
        emotion_tags: formatEmotionTagsForApi(emotionTags),
      })
      navigate(ROUTES.recordDetail(data.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageCanvas className="flex justify-center">
      <CreateRecordForm
        title={title}
        situation={situation}
        emotionTags={emotionTags}
        error={error}
        submitting={submitting}
        onTitleChange={setTitle}
        onSituationChange={setSituation}
        onEmotionTagsChange={setEmotionTags}
        onSubmit={handleSubmit}
      />
    </PageCanvas>
  )
}
