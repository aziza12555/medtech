import { apiService } from "./api";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface ListPatientsResponse {
  items: Patient[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListPatientsParams {
  offset?: number;
  limit?: number;
  search?: string;
}

export const patientsService = {
  getPatients: (params?: ListPatientsParams) =>
    apiService.get<ListPatientsResponse>("/patients", { params }),

  createPatient: (data: CreatePatientDto) =>
    apiService.post<Patient>("/patients", data),

  getPatient: (id: string) => apiService.get<Patient>(`/patients/${id}`),

  updatePatient: (id: string, data: UpdatePatientDto) =>
    apiService.put<Patient>(`/patients/${id}`, data),

  deletePatient: (id: string) => apiService.delete(`/patients/${id}`),
};
