import { create } from "zustand"

type Patient = {
  id: string
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  phone: string
  doctor: string
}

type PatientStore = {
  patients: Patient[]
  addPatient: (patient: Patient) => void
  removePatient: (id: string) => void
}

export const usePatientStore = create<PatientStore>(set => ({
  patients: [],
  addPatient: (patient) => set(state => ({ patients: [...state.patients, patient] })),
  removePatient: (id) => set(state => ({ patients: state.patients.filter(p => p.id !== id) })),
}))
