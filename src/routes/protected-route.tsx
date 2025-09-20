import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authstore'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles = [] }: Props) {
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.role)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />
  }

  return <>{children}</>
}
