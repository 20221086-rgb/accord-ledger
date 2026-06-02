import { parseEmotionTags } from '../../utils/emotionTagUtils'

export default function EmotionTag({ label, className = '' }) {
  const tags = parseEmotionTags(label)
  if (tags.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="font-label-caps text-[10px] text-secondary border border-secondary/30 px-2 py-0.5 rounded-full uppercase"
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}
