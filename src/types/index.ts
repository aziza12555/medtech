export interface User {
  id: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
    firstName: string;
  lastName: string;
  temporaryPassword: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;

}
export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role: string; // yoki Role enumni import qilsangiz ham bo‘ladi
  temporaryPassword: string;
}


export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  doctorId?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
}
export interface UsersStore {
  users: User[];
  addUser: (user: CreateUserDto) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUsersByRole: (role: string) => User[];
}

export interface PatientsStore {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatientsByDoctor: (doctorId: string) => Patient[];
}

export interface AppointmentsStore {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
}

export interface RecordsStore {
  records: MedicalRecord[];
  addRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => void;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByDoctor: (doctorId: string) => MedicalRecord[];
  getRecordsByPatient: (patientId: string) => MedicalRecord[];
}