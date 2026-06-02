import Icon from '../common/Icon'

export default function WalletConnectCard({ busy, localError, onMetaMask }) {
  return (
    <section className="flex justify-center md:justify-end w-full">
      <div className="w-full max-w-md bg-ledger-paper border border-outline-variant/30 p-stack-lg rounded-lg shadow-sm">
        <div className="mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-2">지갑 연결</h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            기록의 소유권을 증명하고 Ledger에 접근하기 위해 지갑을 연결하세요.
          </p>
        </div>

        <button
          type="button"
          onClick={onMetaMask}
          disabled={busy}
          className="group w-full flex items-center justify-between p-4 bg-surface border border-outline-variant hover:border-primary transition-all active:scale-[0.98] rounded-lg disabled:opacity-60"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-md shadow-inner border border-outline-variant flex items-center justify-center">
              <Icon name="account_balance_wallet" className="text-primary" />
            </div>
            <span className="font-body-lg font-bold text-primary">MetaMask</span>
          </div>
          <Icon
            name="chevron_right"
            className="text-outline-variant group-hover:text-primary transition-colors"
          />
        </button>

        {localError && (
          <p className="mt-stack-md rounded-lg border border-error/30 bg-error-container/30 px-4 py-3 text-sm text-error">
            {localError}
          </p>
        )}
      </div>
    </section>
  )
}
