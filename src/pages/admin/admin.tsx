import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Paper,
  MenuItem,
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import Example from './chart'
import { useAuthStore } from '../../store/auth-store'
import { useUsersStore } from '../../store/user'
import type { User } from '../../types'

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

  // Handle Logout with async just in case logout is async
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'doctor' })
    setErrors({})
    setEditingUser(null)
  }

  const validate = () => {
    const errs: { [key: string]: string } = {}

    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'

    if (!editingUser && !form.password.trim()) {
      errs.password = 'Password is required'
    } else if (form.password.trim() && form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }

    return errs
  }

  const handleOpenAdd = () => {
    resetForm()
    setOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    })
    setErrors({})
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    if (editingUser) {
      const updatedData = { ...form }
      if (!form.password.trim()) delete updatedData.password
      updateUser(editingUser.id, updatedData)
    } else {
      addUser(form)
    }

    setOpen(false)
    resetForm()
  }

  const doctors = users.filter(u => u.role === 'doctor')
  const receptions = users.filter(u => u.role === 'reception')

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '190vh', marginLeft: '50px' }}>
      {/* Sidebar or top bar for switching views and logout */}
    

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
            <Paper sx={{ p: 3, mb: 8 }}>
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'grey.600',
                  borderRadius: 1,
                }}
              >
                <Example />
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
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Name</th>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Email</th>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Role</th>
                    <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(view === 'doctors' ? doctors : receptions).map(user => (
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

      </Box>
    </Box>
  )
}
