import { apiService } from "./api";

export interface User {
  id: string;
  email: string;
  role: "admin" | "doctor" | "reception";
  firstname: string;
  lastname: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: "admin" | "doctor" | "reception";
  firstname: string;
  lastname: string;
}

export interface UpdateUserDto {
  email?: string;
  role?: "admin" | "doctor" | "reception";
  firstname?: string;
  lastname?: string;
}

export interface ListUsersResponse {
  items: User[];
  total: number;
  offset: number;
  limit: number;
}

export const usersService = {
  getUsers: (params?: { offset?: number; limit?: number }) =>
    apiService.get<ListUsersResponse>("/users", { params }),

  createUser: (data: CreateUserDto) => apiService.post<User>("/users", data),

  getUser: (id: string) => apiService.get<User>(`/users/${id}`),

  updateUser: (id: string, data: UpdateUserDto) =>
    apiService.put<User>(`/users/${id}`, data),

  deleteUser: (id: string) => apiService.delete(`/users/${id}`),
};
