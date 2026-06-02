import { NavLink } from 'react-router-dom'
import Icon from '../common/Icon'
import { ROUTES } from '../../constants/emotionTags'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'

function NavItem({ to, end, icon, label }) {
  return (
    <NavLink to={to} end={end} className="flex flex-col items-center gap-1 text-[10px] font-label-caps">
      {({ isActive }) => (
        <>
          <Icon
            name={icon}
            filled={isActive}
            className={isActive ? 'text-primary' : 'text-on-surface-variant'}
          />
          <span className={isActive ? 'text-primary' : 'text-on-surface-variant'}>{label}</span>
        </>
      )}
    </NavLink>
  )
}

function LogoutNavItem() {
  const handleLogout = useLogout()

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex flex-col items-center gap-1 text-[10px] font-label-caps text-on-surface-variant"
    >
      <Icon name="logout" />
      <span>로그아웃</span>
    </button>
  )
}

export default function MobileNavigation() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center h-16 z-20">
      <NavItem to={ROUTES.home} end icon="dashboard" label="대시보드" />
      {isAuthenticated ? (
        <>
          <NavItem to={ROUTES.recordNew} icon="add_box" label="새 기록" />
          <LogoutNavItem />
        </>
      ) : (
        <NavItem to={ROUTES.login} icon="account_balance_wallet" label="로그인" />
      )}
    </nav>
  )
}
