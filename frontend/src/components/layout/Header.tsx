import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <span className="text-sm font-medium text-slate-900">{user?.name}</span>
      <Button variant="ghost" onClick={handleLogout}>
        Log out
      </Button>
    </header>
  )
}
