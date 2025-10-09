import { apiService } from "./api";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: "scheduled" | "completed" | "canceled";
  reason?: string;
  createdBy?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  doctor?: {
    id: string;
    firstname: string;
    lastname: string;
    role: string;
  };
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status?: "scheduled" | "completed" | "canceled";
  reason?: string;
}

export interface UpdateAppointmentDto {
  doctorId?: string;
  startAt?: string;
  endAt?: string;
  reason?: string;
  status?: "scheduled" | "completed" | "canceled";
}

export interface ListAppointmentsResponse {
  items: Appointment[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListAppointmentsParams {
  offset?: number;
  limit?: number;
  doctorId?: string;
  patientId?: string;
  from?: string;
  to?: string;
  status?: string;
}

export const appointmentsService = {
  getAppointments: (params?: ListAppointmentsParams) =>
    apiService.get<ListAppointmentsResponse>("/appointments", { params }),

  createAppointment: (data: CreateAppointmentDto) =>
    apiService.post<Appointment>("/appointments", data),

  getAppointment: (id: string) =>
    apiService.get<Appointment>(`/appointments/${id}`),

  updateAppointment: (id: string, data: UpdateAppointmentDto) =>
    apiService.put<Appointment>(`/appointments/${id}`, data),

  updateStatus: (id: string, status: string) =>
    apiService.patch<Appointment>(`/appointments/${id}/status`, { status }),

  deleteAppointment: (id: string) => apiService.delete(`/appointments/${id}`),
};
