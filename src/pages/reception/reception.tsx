import React, { useState } from "react";
import { formatDate } from "../../utilits/utilt";
import { Button, Card, Input, Modal, Table } from "@mui/material";
import { Calendar, Plus, Users } from "lucide-react";


interface AppointmentForm {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  notes: string;
}

export const ReceptionPanel: React.FC = () => {
  const { patients } = usePatientsStore();
  const { appointments, addAppointment } = useAppointmentsStore();
  const { users } = useUsersStore();

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  });

  const doctors = users.filter((user) => user.role === "doctor");

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      ...appointmentForm,
      status: "scheduled" as const,
    });
    setShowAppointmentModal(false);
    setAppointmentForm({
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      type: "",
      notes: "",
    });
  };

  const appointmentColumns = [
    {
      key: "patientId",
      label: "Patient",
      render: (value: string) => {
        const patient = patients.find((p) => p.id === value);
        return patient?.name || "Unknown";
      },
    },
    {
      key: "doctorId",
      label: "Doctor",
      render: (value: string) => {
        const doctor = users.find((u) => u.id === value);
        return doctor ? `Dr. ${doctor.name}` : "Unknown";
      },
    },
    { key: "date", label: "Date", render: (value: string) => formatDate(value) },
    { key: "time", label: "Time" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Reception Panel
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage patients and appointments
        </p>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Total Patients
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {patients.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Total Appointments
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {appointments.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600" />
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Available Doctors
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {doctors.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Doctors */}
      <div className="mb-8">
        <Card title="Available Doctors">
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => {
                const doctorPatients = patients.filter(
                  (p) => p.doctorId === doctor.id
                );
                const doctorAppointments = appointments.filter(
                  (a) => a.doctorId === doctor.id
                );

                return (
                  <div
                    key={doctor.id}
                    className="bg-gray-50 p-4 rounded-lg border"
                  >
                    <h4 className="font-semibold text-gray-900">
                      Dr. {doctor.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {doctor.email}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                      <span className="text-blue-600">
                        {doctorPatients.length} Patients
                      </span>
                      <span className="text-green-600">
                        {doctorAppointments.length} Appointments
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No doctors available
            </p>
          )}
        </Card>
      </div>

      {/* Appointments Section */}
      <div className="mb-8">
        <Card title="Appointments">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <div></div>
            <Button
              onClick={() => setShowAppointmentModal(true)}
              className="flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Plus size={16} />
              <span>Schedule Appointment</span>
            </Button>
          </div>
          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table data={appointments} columns={appointmentColumns} />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No appointments scheduled yet
            </p>
          )}
        </Card>
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        title="Schedule Appointment"
        size="lg"
      >
        <form onSubmit={handleAppointmentSubmit} className="space-y-4">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patient
            </label>
            <select
              value={appointmentForm.patientId}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  patientId: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            <select
              value={appointmentForm.doctorId}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  doctorId: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <Input
            label="Date"
            type="date"
            value={appointmentForm.date}
            onChange={(e) =>
              setAppointmentForm((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />

          {/* Time */}
          <Input
            label="Time"
            type="time"
            value={appointmentForm.time}
            onChange={(e) =>
              setAppointmentForm((prev) => ({ ...prev, time: e.target.value }))
            }
            required
          />

          {/* Type */}
          <Input
            label="Appointment Type"
            value={appointmentForm.type}
            onChange={(e) =>
              setAppointmentForm((prev) => ({ ...prev, type: e.target.value }))
            }
            placeholder="e.g., Consultation, Follow-up, Check-up"
            required
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={appointmentForm.notes}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Schedule Appointment
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAppointmentModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
