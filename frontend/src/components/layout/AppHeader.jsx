import { Link } from 'react-router-dom'
import Icon from '../common/Icon'
import { ROUTES } from '../../constants/emotionTags'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'
import { formatWallet } from '../../utils/format'

export default function AppHeader({ title }) {
  const { isAuthenticated, walletAddress } = useAuth()
  const handleLogout = useLogout()

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-10 h-16">
      <div className="flex justify-between items-center h-full px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-4">
          <span className="md:hidden text-primary">
            <Icon name="menu" />
          </span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary">{title}</h2>
        </div>
        <div className="flex items-center gap-stack-md">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline font-mono-sm text-mono-sm text-hash-blue">
                {formatWallet(walletAddress)}
              </span>
              <Link
                to={ROUTES.recordNew}
                className="hidden md:inline-flex items-center gap-2 bg-primary text-ledger-paper px-6 py-2 rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition"
              >
                <Icon name="add" size="18px" />
                새 기록 만들기
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 border border-outline-variant text-on-surface-variant px-3 py-2 rounded-lg font-label-caps text-label-caps hover:border-secondary/40 hover:text-primary transition"
                title="로그아웃"
              >
                <Icon name="logout" size="18px" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </>
          ) : (
            <Link
              to={ROUTES.login}
              className="flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg font-label-caps text-label-caps"
            >
              <Icon name="account_balance_wallet" size="18px" />
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
