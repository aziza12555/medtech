import { create } from 'zustand';
import type{ UsersStore, User } from '../types';
import { generateId } from '../utilits/utilt';

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: JSON.parse(localStorage.getItem('medtech-users') || '[]'),

  addUser: (userData) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...get().users, newUser];
    localStorage.setItem('medtech-users', JSON.stringify(updatedUsers));
    set({ users: updatedUsers });
  },

  updateUser: (id, userData) => {
    const updatedUsers = get().users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    );
    localStorage.setItem('medtech-users', JSON.stringify(updatedUsers));
    set({ users: updatedUsers });
  },

  deleteUser: (id) => {
    const updatedUsers = get().users.filter(user => user.id !== id);
    localStorage.setItem('medtech-users', JSON.stringify(updatedUsers));
    set({ users: updatedUsers });
  },

  getUsersByRole: (role) => {
    return get().users.filter(user => user.role === role);
  },
}));