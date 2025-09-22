
import React, { useEffect, useState } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
}

interface Patient {
  id: string;
  name: string;
  createdAt: string;
}

const mockTodayAppointments: Appointment[] = [
  { id: '1', patientName: 'John Doe', time: '10:00 AM' },
  { id: '2', patientName: 'Jane Smith', time: '11:30 AM' },
];

const mockNewPatients: Patient[] = [
  { id: 'p1', name: 'Ali Valiyev', createdAt: '2025-09-15' },
  { id: 'p2', name: 'Zarina Karimova', createdAt: '2025-09-16' },
];

const mockDoctorAppointments: Appointment[] = [
  { id: '1', patientName: 'John Doe', time: '10:00 AM' },
  { id: '3', patientName: 'Michael Johnson', time: '02:00 PM' },
];

const Dashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [newPatients, setNewPatients] = useState<Patient[]>([]);
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTodayAppointments(mockTodayAppointments);
      setNewPatients(mockNewPatients);
      setDoctorAppointments(mockDoctorAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h2>Bugungi Uchrashuvlar soni: {todayAppointments.length}</h2>

      <h3>Oxirgi 7 kun ichida qo'shilgan bemorlar:</h3>
      <ul>
        {newPatients.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      <h3>Doctorning Uchrashuvlari (Quick List):</h3>
      <ul>
        {doctorAppointments.map((app) => (
          <li key={app.id}>
            {app.patientName} — {app.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
