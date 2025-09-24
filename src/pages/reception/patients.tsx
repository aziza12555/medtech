import { useState } from "react";
import { useUsersStore } from "../../store/user";
import { usePatientsStore } from "../../store/patients";
import { Button, Card, Input, Modal, Table } from "@mui/material";
import { Plus } from "lucide-react";


const Patients = () => {
  const { users } = useUsersStore();
  const { patients } = usePatientsStore();

  const doctors = users.filter((user) => user.role === "doctor");

  interface PatientForm {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    address: string;
    doctorId: string;
  }
  const { addPatient } = usePatientsStore();

  const [showPatientModal, setShowPatientModal] = useState(false);

  const [patientForm, setPatientForm] = useState<PatientForm>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    doctorId: "",
  });

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient(patientForm);
    setShowPatientModal(false);
    setPatientForm({
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      doctorId: "",
    });
  };
  const patientColumns = [
    { key: "name", label: "Patient Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      render: (value: string) => formatDate(value),
    },
    { key: "gender", label: "Gender" },
    { key: "address", label: "Address" },
    {
      key: "doctorId",
      label: "Doctor",
      render: (value: string) => {
        const doctor = users.find((u) => u.id === value);
        return doctor ? `Dr. ${doctor.name}` : "Not Assigned";
      },
    },
  ];
  return (
    <div>
      <div className="mb-8">
        <Card title="Patients">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button
              onClick={() => setShowPatientModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Patient</span>
            </Button>
          </div>
          {patients.length > 0 ? (
            <Table data={patients} columns={patientColumns} />
          ) : (
            <p className="text-gray-500 text-center py-4">
              No patients registered yet
            </p>
          )}
        </Card>
      </div>
      <Modal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title="Add New Patient"
        size="lg"
        >
          
        <form onSubmit={handlePatientSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={patientForm.name}
            onChange={(e) =>
              setPatientForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <Input
            label="Email"
            type="email"
            value={patientForm.email}
            onChange={(e) =>
              setPatientForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <Input
            label="Phone"
            value={patientForm.phone}
            onChange={(e) =>
              setPatientForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            value={patientForm.dateOfBirth}
            onChange={(e) =>
              setPatientForm((prev) => ({
                ...prev,
                dateOfBirth: e.target.value,
              }))
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={patientForm.gender}
              onChange={(e) =>
                setPatientForm((prev) => ({
                  ...prev,
                  gender: e.target.value as PatientForm["gender"],
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Input
            label="Address"
            value={patientForm.address}
            onChange={(e) =>
              setPatientForm((prev) => ({ ...prev, address: e.target.value }))
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Doctor
            </label>
            <select
              value={patientForm.doctorId}
              onChange={(e) =>
                setPatientForm((prev) => ({
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

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Patient
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPatientModal(false)}
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

export default Patients;
