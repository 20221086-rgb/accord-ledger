import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from './AppHeader'
import MobileNavigation from './MobileNavigation'
import Sidebar from './Sidebar'

const PAGE_TITLES = {
  '/': '대시보드',
  '/records/new': '갈등 기록 시작하기',
}

function resolveTitle(pathname) {
  if (pathname.startsWith('/records/') && pathname !== '/records/new') {
    return '기록 상세'
  }
  return PAGE_TITLES[pathname] || 'AccordLedger'
}

export default function LedgerLayout() {
  const { pathname } = useLocation()
  const title = resolveTitle(pathname)

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen pb-16 md:pb-0">
        <AppHeader title={title} />
        <Outlet />
      </div>
      <MobileNavigation />
    </div>
  )
}
