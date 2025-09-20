import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type UserRole = 'doctor' | 'reception' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
}

interface UsersState {
  users: User[]
  addUser: (user: Omit<User, 'id'>) => void
  updateUser: (id: string, data: { name: string; email: string; password?: string; role: UserRole }) => void
  deleteUser: (id: string) => void
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [
    { id: uuidv4(), name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { id: uuidv4(), name: 'Receptionist One', email: 'reception@example.com', password: 'reception123', role: 'reception' },
    { id: uuidv4(), name: 'Doctor One', email: 'doctor@example.com', password: 'doctor123', role: 'doctor' },
  ],

  addUser: (user) => set(state => ({
    users: [...state.users, { ...user, id: uuidv4() }]
  })),

  updateUser: (id, data) => set(state => ({
    users: state.users.map(u => {
      if (u.id === id) {
        // password faqat bo'sh bo'lmasa yangilanadi
        const updatedUser = {
          ...u,
          name: data.name,
          email: data.email,
          role: data.role,
        }
        if (data.password && data.password.trim() !== '') {
          updatedUser.password = data.password
        }
        return updatedUser
      }
      return u
    })
  })),

  deleteUser: (id) => set(state => ({
    users: state.users.filter(u => u.id !== id)
  })),
}))
