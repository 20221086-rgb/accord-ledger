export default function Icon({ name, className = '', filled = false, size }) {
  const sizeStyle = size ? { fontSize: size } : undefined
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'filled' : ''} ${className}`}
      style={sizeStyle}
      aria-hidden
    >
      {name}
    </span>
  )
}
