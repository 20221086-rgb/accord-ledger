import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginHero from '../components/login/LoginHero'
import WalletConnectCard from '../components/login/WalletConnectCard'
import { ROUTES } from '../constants/emotionTags'
import { useAuth } from '../context/AuthContext'

export default function WalletLoginPage() {
  const navigate = useNavigate()
  const { loginWithWallet, isAuthenticated, setError } = useAuth()
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.home, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleMetaMask = async () => {
    setBusy(true)
    setLocalError(null)
    setError(null)
    try {
      await loginWithWallet()
      navigate(ROUTES.home)
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen hash-pattern font-body-md text-on-background selection:bg-secondary-fixed">
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-gutter z-50 bg-background/80 backdrop-blur-sm border-b border-outline-variant/20">
        <Link to={ROUTES.home} className="font-headline-lg text-headline-lg font-bold text-primary">
          AccordLedger
        </Link>
      </header>

      <main className="flex min-h-screen items-center justify-center p-margin-mobile md:p-gutter pt-20">
        <div className="w-full max-w-container-max grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <LoginHero />
          <WalletConnectCard busy={busy} localError={localError} onMetaMask={handleMetaMask} />
        </div>
      </main>
    </div>
  )
}
