import { api } from "./api";

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorDto {
  firstName: string;
  lastName: string;
  specialization: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {}

export interface ListDoctorsParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
}

export const doctorsService = {
  // Barcha doctorlarni olish
  getDoctors: async (params?: ListDoctorsParams) => {
    const response = await api.get("/doctors", { params });
    return response;
  },

  // ID bo'yicha doctor olish
  getDoctor: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response;
  },

  // Yangi doctor yaratish
  createDoctor: async (data: CreateDoctorDto) => {
    const response = await api.post("/doctors", data);
    return response;
  },

  // Doctor ma'lumotlarini yangilash
  updateDoctor: async (id: string, data: UpdateDoctorDto) => {
    const response = await api.patch(`/doctors/${id}`, data);
    return response;
  },

  // Doctor ni o'chirish
  deleteDoctor: async (id: string) => {
    const response = await api.delete(`/doctors/${id}`);
    return response;
  },

  // Doctorlarni qidirish
  searchDoctors: async (query: string) => {
    const response = await api.get("/doctors/search", {
      params: { q: query },
    });
    return response;
  },
};
