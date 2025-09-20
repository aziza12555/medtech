import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import { useUsersStore, type User } from '../../store/users-store'
import { useAuthStore } from '../../store/authstore'
import { useNavigate } from 'react-router-dom'

const style = {
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

type View = 'dashboard' | 'doctors' | 'patients' | 'receptions'

export default function AdminPanel() {
  const { users, addUser, updateUser, deleteUser } = useUsersStore()
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [view, setView] = useState<View>('dashboard')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Logout
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Reset form state
  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'doctor' })
    setErrors({})
    setEditingUser(null)
  }

  // Validate form
  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    // Password required if adding new user
    if (!editingUser && !form.password.trim()) errs.password = 'Password is required'
    else if (form.password.trim() && form.password.length < 6)
      errs.password = 'Password must be at least 6 chars'
    return errs
  }

  // Open Add User modal
  const handleOpenAdd = () => {
    resetForm()
    setOpen(true)
  }

  // Open Edit User modal
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role }) // leave password empty on edit
    setOpen(true)
  }

  // Delete user confirmation
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
    }
  }

  // Submit Add/Edit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    if (editingUser) {
      updateUser(editingUser.id, form)
    } else {
      addUser(form)
    }

    setOpen(false)
    resetForm()
  }

  // Filter users by role
  const doctors = users.filter(u => u.role === 'doctor')
  const receptions = users.filter(u => u.role === 'reception')

  // Sidebar item click handler
  const handleViewChange = (newView: View) => {
    setView(newView)
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 220,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Admin Panel
        </Typography>
        <List sx={{ flexGrow: 1 }}>
          <ListItem
            button
            selected={view === 'dashboard'}
            onClick={() => handleViewChange('dashboard')}
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            selected={view === 'doctors'}
            onClick={() => handleViewChange('doctors')}
          >
            <ListItemText primary="Doctors" />
          </ListItem>
          <ListItem
            button
            selected={view === 'patients'}
            onClick={() => handleViewChange('patients')}
          >
            <ListItemText primary="Patients" />
          </ListItem>
          <ListItem
            button
            selected={view === 'receptions'}
            onClick={() => handleViewChange('receptions')}
          >
            <ListItemText primary="Receptions" />
          </ListItem>
        </List>
        <Divider sx={{ bgcolor: 'white', mb: 2 }} />
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        {view === 'dashboard' && (
          <>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">Users Summary</Typography>
              <Typography>Total Users: {users.length}</Typography>
              <Typography>Doctors: {doctors.length}</Typography>
              <Typography>Receptions: {receptions.length}</Typography>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Statistics Charts (placeholder)
              </Typography>
              <Box
                sx={{
                  height: 200,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'grey.600',
                  borderRadius: 1,
                }}
              >
                <Typography>Chart Component Here</Typography>
              </Box>
            </Paper>
          </>
        )}

        {(view === 'doctors' || view === 'receptions') && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" textTransform="capitalize">
                {view}
              </Typography>
              <Button variant="contained" onClick={handleOpenAdd}>
                Add {view.slice(0, -1)}
              </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
              <table width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Name</th>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Email</th>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Role</th>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(view === 'doctors' ? doctors : receptions).map((user) => (
                    <tr key={user.id}>
                      <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>{user.name}</td>
                      <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>{user.email}</td>
                      <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>{user.role}</td>
                      <td style={{ borderBottom: '1px solid #ddd', padding: 8 }}>
                        <Button size="small" onClick={() => handleEdit(user)} sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDelete(user.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paper>
          </>
        )}

        {view === 'patients' && (
          <>
            <Typography variant="h4" mb={2}>
              Patients
            </Typography>
            <Typography color="text.secondary">Patients list is not implemented yet.</Typography>
          </>
        )}

        {/* Add/Edit User Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style} component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" mb={2}>
              {editingUser ? 'Edit User' : 'Add User'}
            </Typography>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={!!errors.password}
              helperText={
                editingUser
                  ? 'Leave blank to keep current password'
                  : errors.password
              }
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              margin="normal"
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="reception">Reception</MenuItem>
            </TextField>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editingUser ? 'Update' : 'Add'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  )
}
