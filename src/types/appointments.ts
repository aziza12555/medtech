// src/types/appointments.ts
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: "scheduled" | "completed" | "canceled";
  reason?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
  sort?: "startAsc" | "startDesc" | "createdDesc";
}
