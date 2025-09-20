import React from 'react'
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material'
import { useAuthStore } from '../../store/authstore'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../../routes/patients-context'

export default function DoctorPanel() {
  const role = useAuthStore(state => state.role)
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const { patients } = usePatients()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={2}>
        Doctor paneliga xush kelibsiz, {role}
      </Typography>

      <Paper>
        <List>
          {patients.length === 0 && (
            <Typography sx={{ p: 2 }} color="text.secondary">
              No patients assigned yet.
            </Typography>
          )}
          {patients.map(patient => (
            <React.Fragment key={patient.id}>
              <ListItem>
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

      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 3 }}>
        Logout
      </Button>
    </Container>
  )
}
