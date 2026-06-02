import Icon from '../../common/Icon'
import { shortHash } from '../../../utils/format'

export default function HashBadge({ hash, icon = 'verified', className = '' }) {
  if (!hash) return null
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-hash-blue/20 bg-hash-blue/10 px-2.5 py-1 font-mono text-xs text-hash-blue ${className}`}
    >
      <Icon name={icon} size="14px" className="shrink-0" />
      <span>{shortHash(hash)}</span>
    </span>
  )
}
