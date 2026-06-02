import { Link, NavLink } from 'react-router-dom'
import Icon from '../common/Icon'
import { ROUTES } from '../../constants/emotionTags'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'
import { formatWallet } from '../../utils/format'

const navClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-label-caps text-label-caps ${
    isActive
      ? 'bg-secondary-container text-on-secondary-container font-bold translate-x-1'
      : 'text-on-surface-variant hover:bg-surface-container-low'
  }`

export default function Sidebar() {
  const { isAuthenticated, walletAddress } = useAuth()
  const handleLogout = useLogout()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 z-20 p-stack-md bg-ledger-paper border-r border-outline-variant">
      <div className="mb-stack-lg">
        <Link to={ROUTES.home} className="font-headline-md text-headline-md font-bold text-primary">
          AccordLedger
        </Link>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-70 mt-1">
          Immutable Record
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        <NavLink to={ROUTES.home} end className={navClass}>
          <Icon name="dashboard" />
          <span>대시보드</span>
        </NavLink>
        {isAuthenticated && (
          <NavLink to={ROUTES.recordNew} className={navClass}>
            <Icon name="add_box" />
            <span>새 기록 만들기</span>
          </NavLink>
        )}
      </nav>
      <div className="mt-auto pt-stack-md border-t border-outline-variant space-y-1">
        {!isAuthenticated ? (
          <Link
            to={ROUTES.login}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-caps text-label-caps"
          >
            <Icon name="account_balance_wallet" />
            <span>지갑 연결</span>
          </Link>
        ) : (
          <>
            <div className="px-4 py-2 font-mono-sm text-mono-sm text-hash-blue">
              {formatWallet(walletAddress)}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-caps text-label-caps"
            >
              <Icon name="logout" />
              <span>로그아웃</span>
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
