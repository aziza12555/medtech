import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

const initialDoctors = [
  { id: "1", name: "Dr. Aziz", specialty: "Stomotolog", email: "aziz@pc.local" },
  { id: "2", name: "Dr. Dilnoza", specialty: "Pediatr", email: "dilnoza@example.com" },
];

const DoctorforAdmin = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState({ name: "", specialty: "", email: "" });
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openAddDoctor = () => {
    setEditingDoctor(null);
    setForm({ name: "", specialty: "", email: "" });
    setModalOpen(true);
  };

  const openEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setForm({ name: doctor.name, specialty: doctor.specialty, email: doctor.email });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and Email are required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingDoctor) {
      setDoctors((prev) =>
        prev.map((d) => (d.id === editingDoctor.id ? { ...editingDoctor, ...form } : d))
      );
      setSnackbar({ open: true, message: "Doctor updated successfully", severity: "success" });
    } else {
      setDoctors((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form },
      ]);
      setSnackbar({ open: true, message: "Doctor added successfully", severity: "success" });
    }
    setModalOpen(false);
  };

  const openConfirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    setDoctors((prev) => prev.filter((d) => d.id !== deleteId));
    setConfirmOpen(false);
    setSnackbar({ open: true, message: "Doctor deleted successfully", severity: "info" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  return (
    <Box p={3} sx={{ pb: 8, overflowX: "auto" }}>
      <Typography variant="h4" sx={{ ml: "50px"}} gutterBottom>
        Doctor Management Panel (Admin)
      </Typography>
      <Button variant="contained" sx={{ ml: "50px"}} color="primary" onClick={openAddDoctor}>
        Add Doctor
      </Button>
      <Table sx={{ mt: 2, ml: "30px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Specialty</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>{doctor.name}</TableCell>
              <TableCell>{doctor.specialty}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell align="right">
                <Button size="small" onClick={() => openEditDoctor(doctor)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => openConfirmDelete(doctor.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Specialty"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            type="email"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingDoctor ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this doctor?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorforAdmin;
