// store/user.ts
import { create } from 'zustand';
import { generateId } from '../utilits/utilt';
import type { CreateUserDto, User, UsersStore } from '../types';

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: JSON.parse(localStorage.getItem('medtech-users') || '[]'),

  addUser: async (userData: CreateUserDto) => {
    const newUser: User = {
      id: generateId(),
      email: userData.email,
      role: userData.role,
      mustChangePassword: false,
      firstName: userData.firstName,
      lastName: userData.lastName,
      temporaryPassword: userData.temporaryPassword,
    };

    const updatedUsers = [...get().users, newUser];
    localStorage.setItem('medtech-users', JSON.stringify(updatedUsers));
    set({ users: updatedUsers });
  },

  updateUser: async (id, partialUser) => {
    const updatedUsers = get().users.map((user) =>
      user.id === id ? { ...user, ...partialUser } : user
    );
    localStorage.setItem('medtech-users', JSON.stringify(updatedUsers));
    set({ users: updatedUsers });
  },

  deleteUser: async (id) => {
    const updatedUsers = get().users.filter((user) => user.id !== id);
    localStorage.setItem('medtech-users', JSON.stringify(updatedUsers));
    set({ users: updatedUsers });
  },

  getUsersByRole: (role) => {
    return get().users.filter((user) => user.role === role);
  },
}));
