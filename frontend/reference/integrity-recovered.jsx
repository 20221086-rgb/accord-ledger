

===NEW===

import { useState } from 'react'
import { verifyRecord } from '../api/records'

function shortHash(value) {
  if (!value) return '—'
  return value.length > 16 ? `${value.slice(0, 8)}...${value.slice(-8)}` : value
}

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

  return (
    <div className="rounded-3xl border border-[#FFD1DC] bg-[#FFFBFC] p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#5A4A42]">기록 무결성 확인</h3>
      <p className="mt-2 text-sm text-[#8B7B73]">
        이 기록은 SHA-256 해시 체인으로 연결되어 있어 변조 여부를 확인할 수 있습니다.
      </p>

      <button
        type="button"
        onClick={open && result ? () => setOpen((v) => !v) : loadVerification}
        disabled={loading}
        className="mt-4 w-full rounded-2xl bg-[#FFB6D9] px-4 py-3 font-medium text-[#5A4A42] transition hover:bg-[#FFC0D9] disabled:opacity-60"
      >
        {loading ? '검증 중...' : open ? '접기' : '펼치기 · 검증 실행'}
      </button>

      {error && <p className="mt-3 text-sm text-[#c45c6a]">{error}</p>}

      {open && result && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Metric
            label="Chain Valid"
            value={result.chain_valid ? '✓ PASS' : '✗ FAIL'}
            ok={result.chain_valid}
          />
          <Metric label="Record Hash" value={shortHash(result.record_hash)} />
          <Metric label="Latest Hash" value={shortHash(result.latest_hash)} />
          <Metric
            label="Previous Hash"
            value={shortHash(result.items?.[result.items.length - 1]?.previous_hash)}
          />
          <Metric
            label="Tamper Detected"
            value={result.tamper_detected ? 'Yes' : 'No'}
            ok={!result.tamper_detected}
          />
          <Metric label="Last Verified At" value={result.last_verified_at || '—'} />
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, ok }) {
  const tone =
    ok === true
      ? 'border-[#B5E7A0] bg-[#f3fbeb]'
      : ok === false
        ? 'border-[#FFB6C1] bg-[#fff0f3]'
        : 'border-[#FFD1DC] bg-white'
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="text-xs font-medium text-[#8B7B73]">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold text-[#5A4A42]">{value}</p>
    </div>
  )
}


===NEW===

import { useState } from 'react'
import { verifyRecord } from '../api/records'
import Icon from './Icon'

function shortHash(value) {
  if (!value) return '-'
  return value.length > 16 ? `${value.slice(0, 8)}...${value.slice(-8)}` : value
}

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
    setOpen((v) => !v)
  }

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
              className={result?.chain_valid ? 'text-integrity-green' : 'text-correction-amber'}
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

      {error && (
        <p className="px-gutter pb-4 text-sm text-error">{error}</p>
      )}

      {open && result && (
        <div className="border-t border-outline-variant/30 p-gutter space-y-stack-md bg-surface-container-low/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <div className="p-stack-md border border-outline-variant bg-white flex items-center justify-between rounded-lg">
              <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                  Chain Valid
                </div>
                <div
                  className={`font-headline-md text-headline-md flex items-center gap-2 ${
                    result.chain_valid ? 'text-integrity-green' : 'text-error'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${result.chain_valid ? 'bg-integrity-green' : 'bg-error'}`}
                  />
                  {result.chain_valid ? 'PASS' : 'FAIL'}
                </div>
              </div>
              <Icon name="link" className="text-integrity-green text-4xl opacity-20" />
            </div>
            <div className="p-stack-md border border-outline-variant bg-white flex items-center justify-between rounded-lg">
              <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                  Tamper Detected
                </div>
                <div
                  className={`font-headline-md text-headline-md ${
                    result.tamper_detected ? 'text-error' : 'text-integrity-green'
                  }`}
                >
                  {result.tamper_detected ? 'Yes' : 'No'}
                </div>
              </div>
              <Icon name="task_alt" className="text-integrity-green text-4xl opacity-20" />
            </div>
          </div>

          <div className="p-stack-md border border-outline-variant bg-ink-charcoal rounded-lg text-ledger-paper space-y-3">
            <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase block">
              Hash Summary
            </span>
            <div>
              <label className="font-label-caps text-label-caps text-on-primary-container block mb-1">
                Record Hash
              </label>
              <div className="font-mono-sm text-mono-sm text-primary-fixed bg-black/40 p-2 break-all rounded">
                {shortHash(result.record_hash)}
              </div>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-primary-container block mb-1">
                Latest Hash
              </label>
              <div className="font-mono-sm text-mono-sm text-primary-fixed bg-black/40 p-2 break-all rounded">
                {shortHash(result.latest_hash)}
              </div>
            </div>
            <p className="font-mono-sm text-mono-sm text-on-primary-container pt-2 border-t border-white/10">
              Last Verified: {result.last_verified_at || '-'}
            </p>
          </div>

          <p className="text-on-surface-variant font-body-md text-sm text-center">
            무결성 검증은 Record 신뢰를 보조하는 기능입니다. 타임라인 기록이 주 화면입니다.
          </p>
        </div>
      )}

      {loading && (
        <p className="px-gutter pb-4 text-sm text-on-surface-variant">검증 중...</p>
      )}
    </section>
  )
}


===NEW===

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
    setOpen((v) => !v)
  }

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
              className={result?.chain_valid ? 'text-integrity-green' : 'text-correction-amber'}
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
            <HashRow label="Record Hash" value={shortHash(result.record_hash)} />
            <HashRow label="Latest Hash" value={shortHash(result.latest_hash)} />
            <p className="font-mono-sm text-mono-sm text-on-primary-container pt-2 border-t border-white/10">
              Last Verified: {result.last_verified_at || '-'}
            </p>
          </div>

          <p className="text-on-surface-variant font-body-md text-sm text-center">
            무결성 검증은 Record 신뢰를 보조하는 기능입니다. 타임라인 기록이 주 화면입니다.
          </p>
        </div>
      )}

      {loading && (
        <p className="px-gutter pb-4 text-sm text-on-surface-variant">검증 중...</p>
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


===NEW===

import { useState } from 'react'
import { verifyRecord } from '../../api/records'
import Icon from '../common/Icon'
import { shortHash } from '../../utils/format'

function MetricTile({ label, value, ok }) {
  const tone =
    ok === true
      ? 'border-integrity-green/30 bg-[#f3fbeb]'
      : ok === false
        ? 'border-error/30 bg-error-container/40'
        : 'border-outline-variant/50 bg-white'

  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 break-all font-mono text-sm text-primary">{value}</p>
    </div>
  )
}

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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    if (!open && !result && !loading) {
      await loadVerification()
    }
    setOpen((prev) => !prev)
  }

  const previousHash =
    result?.items?.length > 0
      ? result.items[result.items.length - 1]?.previous_hash
      : ''

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-ledger-paper shadow-[0_4px_20px_rgba(101,94,72,0.06)]">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-surface-container-low/80 md:p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-integrity-green/15">
            <Icon name="verified_user" filled className="text-integrity-green" size="22px" />
          </div>
          <div>
            <h3 className="font-headline-md text-lg font-semibold text-primary">기록 무결성 확인</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              SHA-256 해시 체인으로 변조 여부를 확인할 수 있습니다.
            </p>
          </div>
        </div>
        <Icon
          name="expand_more"
          className={`shrink-0 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {loading && (
        <p className="border-t border-outline-variant/30 px-5 pb-4 text-sm text-on-surface-variant md:px-6">
          검증 중...
        </p>
      )}

      {error && (
        <p className="border-t border-outline-variant/30 px-5 pb-4 text-sm text-error md:px-6">
          {error}
        </p>
      )}

      {open && result && (
        <div className="space-y-4 border-t border-outline-variant/30 bg-surface-container-low/40 p-5 md:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MetricTile
              label="Chain Valid"
              value={result.chain_valid ? 'PASS' : 'FAIL'}
              ok={result.chain_valid}
            />
            <MetricTile
              label="Tamper Detected"
              value={result.tamper_detected ? 'Yes' : 'No'}
              ok={!result.tamper_detected}
            />
            <MetricTile label="Record Hash" value={shortHash(result.record_hash) || '-'} />
            <MetricTile label="Latest Hash" value={shortHash(result.latest_hash) || '-'} />
            <MetricTile label="Previous Hash" value={shortHash(previousHash) || '-'} />
            <MetricTile
              label="Last Verified At"
              value={result.last_verified_at || '-'}
            />
          </div>
          <p className="text-center text-xs text-on-surface-variant">
            무결성 검증은 보조 기능입니다. 타임라인 기록이 이 화면의 중심입니다.
          </p>
        </div>
      )}
    </section>
  )
}
