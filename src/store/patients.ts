import { create } from 'zustand';
import type{ PatientsStore, Patient } from '../types';
import { generateId } from '../utilits/utilt';

export const usePatientsStore = create<PatientsStore>((set, get) => ({
  patients: JSON.parse(localStorage.getItem('medtech-patients') || '[]'),

  addPatient: (patientData) => {
    const newPatient: Patient = {
      ...patientData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedPatients = [...get().patients, newPatient];
    localStorage.setItem('medtech-patients', JSON.stringify(updatedPatients));
    set({ patients: updatedPatients });
  },

  updatePatient: (id, patientData) => {
    const updatedPatients = get().patients.map(patient => 
      patient.id === id ? { ...patient, ...patientData } : patient
    );
    localStorage.setItem('medtech-patients', JSON.stringify(updatedPatients));
    set({ patients: updatedPatients });
  },

  deletePatient: (id) => {
    const updatedPatients = get().patients.filter(patient => patient.id !== id);
    localStorage.setItem('medtech-patients', JSON.stringify(updatedPatients));
    set({ patients: updatedPatients });
  },

  getPatientsByDoctor: (doctorId) => {
    return get().patients.filter(patient => patient.doctorId === doctorId);
  },
}));