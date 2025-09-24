import { create } from 'zustand';
import type{ RecordsStore, MedicalRecord } from '../types';
import { generateId } from '../utilits/utilt';

export const useRecordsStore = create<RecordsStore>((set, get) => ({
  records: JSON.parse(localStorage.getItem('medtech-records') || '[]'),

  addRecord: (recordData) => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedRecords = [...get().records, newRecord];
    localStorage.setItem('medtech-records', JSON.stringify(updatedRecords));
    set({ records: updatedRecords });
  },

  updateRecord: (id, recordData) => {
    const updatedRecords = get().records.map(record => 
      record.id === id ? { ...record, ...recordData } : record
    );
    localStorage.setItem('medtech-records', JSON.stringify(updatedRecords));
    set({ records: updatedRecords });
  },

  deleteRecord: (id) => {
    const updatedRecords = get().records.filter(record => record.id !== id);
    localStorage.setItem('medtech-records', JSON.stringify(updatedRecords));
    set({ records: updatedRecords });
  },

  getRecordsByDoctor: (doctorId) => {
    return get().records.filter(record => record.doctorId === doctorId);
  },

  getRecordsByPatient: (patientId) => {
    return get().records.filter(record => record.patientId === patientId);
  },
}));