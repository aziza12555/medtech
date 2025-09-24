import { create } from 'zustand';
import type{ AppointmentsStore, Appointment } from '../types';
import { generateId } from '../utilits/utilt';

export const useAppointmentsStore = create<AppointmentsStore>((set, get) => ({
  appointments: JSON.parse(localStorage.getItem('medtech-appointments') || '[]'),

  addAppointment: (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedAppointments = [...get().appointments, newAppointment];
    localStorage.setItem('medtech-appointments', JSON.stringify(updatedAppointments));
    set({ appointments: updatedAppointments });
  },

  updateAppointment: (id, appointmentData) => {
    const updatedAppointments = get().appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...appointmentData } : appointment
    );
    localStorage.setItem('medtech-appointments', JSON.stringify(updatedAppointments));
    set({ appointments: updatedAppointments });
  },

  deleteAppointment: (id) => {
    const updatedAppointments = get().appointments.filter(appointment => appointment.id !== id);
    localStorage.setItem('medtech-appointments', JSON.stringify(updatedAppointments));
    set({ appointments: updatedAppointments });
  },

  getAppointmentsByDoctor: (doctorId) => {
    return get().appointments.filter(appointment => appointment.doctorId === doctorId);
  },

  getAppointmentsByPatient: (patientId) => {
    return get().appointments.filter(appointment => appointment.patientId === patientId);
  },
}));