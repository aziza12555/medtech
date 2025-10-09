// src/service/api.ts
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { useAuth, type User } from "../store/auth-store";

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

interface RefreshResponse {
  access_token: string;
  user: User;
}

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - token qo'shish
api.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
    const token = useAuth.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Refresh token handling
let refreshing = false;
let waiters: Array<() => void> = [];

// Response interceptor - token yangilash
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (refreshing) {
        await new Promise<void>((resolve) => {
          waiters.push(resolve);
        });
        const token = useAuth.getState().token;
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        originalRequest._retry = true;
        return api(originalRequest);
      }

      try {
        refreshing = true;
        if (originalRequest) {
          originalRequest._retry = true;
        }

        const { data } = await api.post<RefreshResponse>("/auth/refresh");

        if (data?.access_token) {
          useAuth.getState().login(data.access_token, data.user);

          // Navbatdagi so'rovlarni davom ettirish
          waiters.forEach((resolve) => resolve());
          waiters = [];

          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          }
          return api(originalRequest!);
        }
      } catch (refreshError) {
        useAuth.getState().logout();
        window.location.href = "/login";
        throw refreshError;
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Typed API methods
export const apiService = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.get<ApiResponse<T>>(url, config),

  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.post<ApiResponse<T>>(url, data, config),

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.put<ApiResponse<T>>(url, data, config),

  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.patch<ApiResponse<T>>(url, data, config),

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    api.delete<ApiResponse<T>>(url, config),
};

export default api;
