import React, { createContext, useContext, useState, type ReactNode} from 'react'

export type Patient = {
  id: string
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  phone: string
  doctor: string
}

type PatientsContextType = {
  patients: Patient[]
  addPatient: (patient: Patient) => void
  deletePatient: (id: string) => void
}


const PatientsContext = createContext<PatientsContextType | undefined>(undefined)

export const usePatients = () => {
  const context = useContext(PatientsContext)
  if (!context) {
    throw new Error('usePatients must be used within PatientsProvider')
  }
  return context
}

export const PatientsProvider = ({ children }: { children: ReactNode}) => {
  const [patients, setPatients] = useState<Patient[]>([])

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient])
  }

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id))
  }

  return (
    <PatientsContext.Provider value={{ patients, addPatient, deletePatient }}>
      {children}
    </PatientsContext.Provider>
  )
}
