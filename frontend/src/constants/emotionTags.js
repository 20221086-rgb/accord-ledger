export { ROUTES } from './routes'

export { MAX_EMOTION_TAGS, formatEmotionTagsForApi, parseEmotionTags, toggleEmotionTag } from '../utils/emotionTagUtils'

/** @type {{ label: string, tags: string[] }[]} */
export const EMOTION_TAG_GROUPS = [
  {
    label: '불안 · 긴장',
    tags: ['#불안', '#긴장', '#혼란', '#당황'],
  },
  {
    label: '갈등 · 상처',
    tags: ['#억울함', '#서운함', '#분노', '#실망감'],
  },
  {
    label: '거리 · 회피',
    tags: ['#답답함', '#외로움', '#죄책감', '#회피하고싶음'],
  },
  {
    label: '회복 · 긍정',
    tags: ['#희망', '#안도', '#이해', '#화해하고싶음'],
  },
]

export const EMOTION_TAGS = EMOTION_TAG_GROUPS.flatMap((group) => group.tags)

export const PERSPECTIVE_TYPE_LABELS = {
  me: '내 입장',
  other: '상대 입장',
  correction: '정정 기록',
}
