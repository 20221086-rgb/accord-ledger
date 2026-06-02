export default function EmotionPill({ label, className = '' }) {
  if (!label) return null
  return (
    <span
      className={`inline-flex items-center rounded-full border border-secondary/25 bg-secondary-container px-3 py-1 text-xs font-semibold uppercase tracking-wide text-on-secondary-container ${className}`}
    >
      {label}
    </span>
  )
}
