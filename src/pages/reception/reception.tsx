import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useAppointmentsStore } from "../../store/appointment-Store";
import { usePatientsStore } from "../../store/patients";
import { useUsersStore } from "../../store/user";

import { formatDate } from "../../utilits/utilt";
import { HospitalIcon, NotebookTabs, User } from "lucide-react";

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

  return (
    <Box p={3} sx={{ backgroundColor: "#f9faf9", minHeight: "100vh" }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="#37474f">
          Reception Panel
        </Typography>
        <Typography color="text.secondary">
          Manage patients and appointments
        </Typography>
      </Box>

      {/* Statistic Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={5}>
        <Card
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#e8f5e9", // Pastel Green background
          }}
        >
          <User color="#388e3c" size={48} />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" color="#2e7d32">
              Total Patients
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#1b5e20">
              {patients.length}
            </Typography>
          </Box>
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#ede7f6", // Light Purple background
          }}
        >
          <NotebookTabs color="#6a1b9a" size={48} />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" color="#512da8">
              Total Appointments
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#311b92">
              {appointments.length}
            </Typography>
          </Box>
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#efebe9", // Soft Brown background
          }}
        >
          <HospitalIcon color="#5d4037" size={48} />
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" color="#4e342e">
              Available Doctors
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#4e342e" }}>
              {doctors.length}
            </Typography>
          </Box>
        </Card>
      </Stack>

      {/* Available Doctors */}
      <Box mb={5}>
        <Typography variant="h6" fontWeight="medium" mb={2} color="#37474f">
          Available Doctors
        </Typography>

        {doctors.length > 0 ? (
          <Stack
            direction={{ xs: "column", sm: "row", md: "row" }}
            spacing={3}
            flexWrap="wrap"
          >
            {doctors.map((doctor) => {
              const doctorPatients = patients.filter((p) => p.doctorId === doctor.id);
              const doctorAppointments = appointments.filter(
                (a) => a.doctorId === doctor.id
              );

              return (
                <Card
                  key={doctor.id}
                  sx={{
                    p: 2,
                    flex: "1 1 300px",
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #ccc",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#3e2723">
                    Dr. {doctor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {doctor.email}
                  </Typography>
                  <Stack direction="row" spacing={2} fontSize="0.9rem" color="text.secondary">
                    <Typography color="#388e3c">
                      {doctorPatients.length} Patients
                    </Typography>
                    <Typography color="#6a1b9a">
                      {doctorAppointments.length} Appointments
                    </Typography>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Typography color="text.secondary" align="center" py={4}>
            No doctors available
          </Typography>
        )}
      </Box>

      {/* Appointments Section */}
      <Box mb={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="medium" color="#37474f">
            Appointments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAppointmentModal(true)}
            sx={{
              backgroundColor: "#7b1fa2",
              "&:hover": { backgroundColor: "#6a1b9a" },
            }}
          >
            Schedule Appointment
          </Button>
        </Box>

        {appointments.length > 0 ? (
          <TableContainer component={Card} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#ede7f6" }}>
                <TableRow>
                  <TableCell sx={{ color: "#512da8", fontWeight: "bold" }}>Patient</TableCell>
                  <TableCell sx={{ color: "#512da8", fontWeight: "bold" }}>Doctor</TableCell>
                  <TableCell sx={{ color: "#512da8", fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ color: "#512da8", fontWeight: "bold" }}>Time</TableCell>
                  <TableCell sx={{ color: "#512da8", fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ color: "#512da8", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "#512da8", fontWeight: "bold" }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((app) => {
                  const patient = patients.find((p) => p.id === app.patientId);
                  const doctor = users.find((u) => u.id === app.doctorId);

                  return (
                    <TableRow key={app.id}>
                      <TableCell>{patient?.name || "Unknown"}</TableCell>
                      <TableCell>{doctor ? `Dr. ${doctor.name}` : "Unknown"}</TableCell>
                      <TableCell>{formatDate(app.date)}</TableCell>
                      <TableCell>{app.time}</TableCell>
                      <TableCell>{app.type}</TableCell>
                      <TableCell>{app.status}</TableCell>
                      <TableCell>{app.notes}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary" align="center" py={4}>
            No appointments scheduled yet
          </Typography>
        )}
      </Box>

      {/* Add Appointment Dialog */}
      <Dialog
        open={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: "#4e342e" }}>Schedule Appointment</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleAppointmentSubmit}
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Patient */}
            <FormControl fullWidth required>
              <InputLabel id="patient-select-label" sx={{ color: "#4e342e" }}>
                Select Patient
              </InputLabel>
              <Select
                labelId="patient-select-label"
                value={appointmentForm.patientId}
                label="Select Patient"
                onChange={(e) =>
                  setAppointmentForm((prev) => ({
                    ...prev,
                    patientId: e.target.value,
                  }))
                }
                sx={{ color: "#4e342e" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

                  {/* Doctor */}
            <FormControl fullWidth required>
              <InputLabel id="doctor-select-label" sx={{ color: "#4e342e" }}>
                Select Doctor
              </InputLabel>
              <Select
                labelId="doctor-select-label"
                value={appointmentForm.doctorId}
                label="Select Doctor"
                onChange={(e) =>
                  setAppointmentForm((prev) => ({
                    ...prev,
                    doctorId: e.target.value,
                  }))
                }
                sx={{ color: "#4e342e" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date */}
            <TextField
              label="Date"
              type="date"
              value={appointmentForm.date}
              onChange={(e) =>
                setAppointmentForm((prev) => ({ ...prev, date: e.target.value }))
              }
              InputLabelProps={{
                shrink: true,
                style: { color: "#4e342e" },
              }}
              required
              fullWidth
              sx={{
                input: { color: "#4e342e" },
              }}
            />

            {/* Time */}
            <TextField
              label="Time"
              type="time"
              value={appointmentForm.time}
              onChange={(e) =>
                setAppointmentForm((prev) => ({ ...prev, time: e.target.value }))
              }
              InputLabelProps={{
                shrink: true,
                style: { color: "#4e342e" },
              }}
              required
              fullWidth
              sx={{
                input: { color: "#4e342e" },
              }}
            />

            {/* Type */}
            <TextField
              label="Appointment Type"
              value={appointmentForm.type}
              onChange={(e) =>
                setAppointmentForm((prev) => ({ ...prev, type: e.target.value }))
              }
              placeholder="e.g., Consultation, Follow-up, Check-up"
              required
              fullWidth
              sx={{ input: { color: "#4e342e" } }}
            />

            {/* Notes */}
            <TextField
              label="Notes (Optional)"
              value={appointmentForm.notes}
              onChange={(e) =>
                setAppointmentForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              multiline
              rows={3}
              fullWidth
              sx={{ input: { color: "#4e342e" } }}
            />

            <DialogActions sx={{ px: 0 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  flexGrow: 1,
                  backgroundColor: "#7b1fa2",
                  "&:hover": { backgroundColor: "#6a1b9a" },
                }}
              >
                Schedule Appointment
              </Button>
              <Button
                onClick={() => setShowAppointmentModal(false)}
                variant="outlined"
                sx={{ flexGrow: 1, color: "#4e342e", borderColor: "#4e342e" }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

