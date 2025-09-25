import { create } from 'zustand';
import type { AuthState, User } from '../types';

export const useAuthStore = create<
  AuthState & { isLoading: boolean; fetchMe: () => Promise<void> }
>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,

  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        'https://supercultivated-neumic-rose.ngrok-free.dev/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) return false;

      const data = await res.json();
        console.log(data);
        
      localStorage.setItem('token', data.access_token);

      set({
        user: {
          ...data.user,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        } as User,
        isAuthenticated: true,
        token: data.access_token,
        isLoading: false,
      });

      return true;
    } catch (err) {
      console.error('Login error:', err);
      set({ isLoading: false });
      return false;
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const res = await fetch(
        'https://supercultivated-neumic-rose.ngrok-free.dev/auth/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('FETCH ME RESPONSE STATUS:', res.status);

      if (!res.ok) {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isLoading: false,
        });
        localStorage.removeItem('token');
        return;
      }

      const user: User = await res.json();

      set({
        user,
        isAuthenticated: true,
        token,
        isLoading: false,
      });
    } catch (err) {
      console.error('Fetch me error:', err);
      set({ isLoading: false });
    }
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    const token = get().token || localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await fetch(
        'https://supercultivated-neumic-rose.ngrok-free.dev/auth/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      return res.ok;
    } catch (err) {
      console.error('Change password error:', err);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
    });
  },
}));
