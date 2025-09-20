import { create } from 'zustand'

type UserRole = 'admin' | 'doctor' | 'reception' | null

interface AuthState {
  token: string | null
  role: UserRole
  setAuth: (token: string, role: UserRole) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: (localStorage.getItem('role') as UserRole) || null,
  setAuth: (token, role) => {
    localStorage.setItem('token', token)
    if (role) {
      localStorage.setItem('role', role)
    } else {
      localStorage.removeItem('role')
    }
    set({ token, role })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    set({ token: null, role: null })
  },
}))
