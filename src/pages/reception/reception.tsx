import React, { useState } from 'react'
import {
  Container,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuthStore } from '../../store/authstore'
import { useNavigate } from 'react-router-dom'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
}

type Patient = {
  id: string
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  phone: string
  doctor: string
}

export default function ReceptionPanel() {
  const role = useAuthStore(state => state.role)
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()

  const [patients, setPatients] = useState<Patient[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female',
    phone: '',
    doctor: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    if (!form.doctor.trim()) errs.doctor = 'Doctor is required'
    return errs
  }

  const handleOpen = () => {
    setForm({
      firstName: '',
      lastName: '',
      gender: 'male',
      phone: '',
      doctor: '',
    })
    setErrors({})
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...form,
    }
    setPatients(prev => [...prev, newPatient])
    setOpen(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={2}>
        Reception paneliga xush kelibsiz, {role}
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>
        Add Patient
      </Button>

      {/* Patient List */}
      <Paper>
        <List>
          {patients.length === 0 && (
            <Typography sx={{ p: 2 }} color="text.secondary">
              No patients added yet.
            </Typography>
          )}
          {patients.map(patient => (
            <React.Fragment key={patient.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(patient.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${patient.firstName} ${patient.lastName}`}
                  secondary={`Doctor: ${patient.doctor} | Gender: ${patient.gender} | Phone: ${patient.phone}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Add Patient Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit} sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Add Patient
          </Typography>

          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            error={!!errors.firstName}
            helperText={errors.firstName}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            error={!!errors.lastName}
            helperText={errors.lastName}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={form.gender}
              label="Gender"
              onChange={e =>
                setForm(f => ({
                  ...f,
                  gender: e.target.value as 'male' | 'female',
                }))
              }
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Doctor"
            name="doctor"
            value={form.doctor}
            onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}
            error={!!errors.doctor}
            helperText={errors.doctor}
            margin="normal"
          />

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </Box>
      </Modal>

      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 3 }}>
        Logout
      </Button>
    </Container>
  )
}
