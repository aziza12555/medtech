import axios from 'axios';
import type { ApiResponse, User } from '../types';

const API_URL = 'https://supercultivated-neumic-rose.ngrok-free.dev';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Request interceptor - token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - xatoliklarni boshqarish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin-profile';
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Foydalanuvchi profil ma'lumotlarini olish
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Profilni yangilash
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>('/auth/me', profileData);
    return response.data.data;
  },

  // Avatar yangilash
  updateAvatar: async (avatarFile: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await api.post<ApiResponse<{ avatarUrl: string }>>(
      '/auth/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Parolni yangilash
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      passwordData
    );
    return response.data.data;
  },

  // Admin statistikasini olish (agar mavjud bo'lsa)
  getStats: async (): Promise<{
    totalUsers: number;
    activeSessions: number;
    tasksCompleted: number;
    storageUsed: string;
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        totalUsers: number;
        activeSessions: number;
        tasksCompleted: number;
        storageUsed: string;
      }>>('/admin/stats');
      return response.data.data;
    } catch (error) {
      // Agar stats endpointi mavjud bo'lmasa, default qiymatlar qaytarish
      console.warn('Stats endpointi mavjud emas, default qiymatlar qaytarilmoqda');
      return {
        totalUsers: 0,
        activeSessions: 0,
        tasksCompleted: 0,
        storageUsed: '0GB'
      };
    }
  },
};