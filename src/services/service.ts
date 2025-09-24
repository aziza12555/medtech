import type { PatientFormData } from "../types";

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/patients`;

// API so'rovlari uchun helper
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP xatolik! Status: ${response.status}`);
  }

  return response.json();
};

export const patientService = {
  async getPatients(page: number = 1, limit: number = 10, search?: string, gender?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(gender && { gender }),
    });

    return apiRequest(`${API_URL}?${params}`);
  },

  async createPatient(patientData: PatientFormData) {
    return apiRequest(API_URL, {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  async getPatient(id: string) {
    return apiRequest(`${API_URL}/${id}`);
  },

  async updatePatient(id: string, patientData: Partial<PatientFormData>) {
    return apiRequest(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  async deletePatient(id: string) {
    return apiRequest(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
  },
};