import {  type LoginData, type User } from '../types/index';
import axios from 'axios';

const API_URL = 'https://supercultivated-neumic-rose.ngrok-free.dev';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' 
  },
});

export const authApi = {
  
  login: async (credentials: LoginData): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};