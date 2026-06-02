import { useState } from 'react'
import { verifyRecord } from '../../api/records'
import Icon from '../common/Icon'
import { shortHash } from '../../utils/format'

export default function IntegrityPanel({ recordId }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const loadVerification = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await verifyRecord(recordId)
      setResult(data)
      setOpen(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggle = () => {
    if (!result) {
      loadVerification()
      return
    }
    setOpen((value) => !value)
  }

  const previousHash =
    result?.items?.length > 0
      ? result.items[result.items.length - 1]?.previous_hash
      : ''

  return (
    <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden mt-stack-lg">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className="w-full flex items-center justify-between p-gutter hover:bg-surface-container-high transition-colors text-left group"
      >
        <div className="flex items-center gap-stack-md">
          <div className="w-10 h-10 rounded-full bg-integrity-green/10 flex items-center justify-center shrink-0">
            <Icon
              name="verified_user"
              filled
              className={result?.chain_valid === false ? 'text-correction-amber' : 'text-integrity-green'}
            />
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-primary">기록 무결성 확인</h3>
            <p className="font-body-md text-sm text-on-surface-variant">
              SHA-256 해시 체인으로 변조 여부를 확인할 수 있습니다.
            </p>
          </div>
        </div>
        <Icon
          name="expand_more"
          className={`text-on-surface-variant group-hover:text-primary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {error && <p className="px-gutter pb-4 text-sm text-error">{error}</p>}

      {loading && (
        <p className="px-gutter pb-4 text-sm text-on-surface-variant">검증 중...</p>
      )}

      {open && result && (
        <div className="border-t border-outline-variant/30 p-gutter space-y-stack-md bg-surface-container-low/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <StatusCard
              label="Chain Valid"
              value={result.chain_valid ? 'PASS' : 'FAIL'}
              ok={result.chain_valid}
              icon="link"
            />
            <StatusCard
              label="Tamper Detected"
              value={result.tamper_detected ? '감지됨' : '없음'}
              ok={!result.tamper_detected}
              icon="task_alt"
            />
          </div>

          <div className="p-stack-md border border-outline-variant bg-ink-charcoal rounded-lg text-ledger-paper space-y-3">
            <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase block">
              Hash Summary
            </span>
            <HashRow label="Record Hash" value={shortHash(result.record_hash) || '-'} />
            <HashRow label="Latest Hash" value={shortHash(result.latest_hash) || '-'} />
            <HashRow label="Previous Hash" value={shortHash(previousHash) || '-'} />
            <p className="font-mono-sm text-mono-sm text-on-primary-container pt-2 border-t border-white/10">
              Last Verified: {result.last_verified_at || '-'}
            </p>
          </div>

          <p className="text-on-surface-variant font-body-md text-sm text-center">
            무결성 검증은 Record 신뢰를 보조하는 기능입니다. 타임라인 기록이 주 화면입니다.
          </p>
        </div>
      )}
    </section>
  )
}

function StatusCard({ label, value, ok, icon }) {
  return (
    <div className="p-stack-md border border-outline-variant bg-white flex items-center justify-between rounded-lg">
      <div>
        <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
          {label}
        </div>
        <div
          className={`font-headline-md text-headline-md flex items-center gap-2 ${
            ok ? 'text-integrity-green' : 'text-error'
          }`}
        >
          <span className={`w-3 h-3 rounded-full ${ok ? 'bg-integrity-green' : 'bg-error'}`} />
          {value}
        </div>
      </div>
      <Icon name={icon} className="text-integrity-green text-4xl opacity-20" />
    </div>
  )
}

function HashRow({ label, value }) {
  return (
    <div>
      <label className="font-label-caps text-label-caps text-on-primary-container block mb-1">
        {label}
      </label>
      <div className="font-mono-sm text-mono-sm text-primary-fixed bg-black/40 p-2 break-all rounded">
        {value}
      </div>
    </div>
  )
}
