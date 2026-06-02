import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/emotionTags'
import { useAuth } from '../context/AuthContext'

export function useLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return useCallback(() => {
    logout()
    navigate(ROUTES.login, { replace: true })
  }, [logout, navigate])
}
