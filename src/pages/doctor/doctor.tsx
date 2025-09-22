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
  const role = useAuthStore(state => state.role) // doctorning nomi yoki roli
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const { patients } = usePatients()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Faqat o'ziga tegishli bemorlar
  const myPatients = patients.filter(patient => patient.doctor === role)

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>
        Doctor paneliga xush kelibsiz, {role}
      </Typography>

      <Paper>
        <List>
          {(!myPatients || myPatients.length === 0) && (
            <Typography sx={{ p: 2 }} color="text.secondary">
              Sizga biriktirilgan bemorlar hali yo'q.
            </Typography>
          )}
          {myPatients && myPatients.map((patient) => (
            <React.Fragment key={patient.id}>
              <ListItem>
                <ListItemText
                  primary={`${patient.firstName} ${patient.lastName}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Doctor: {patient.doctor}
                      </Typography>
                      {' — '}
                      Gender: {patient.gender} | Phone: {patient.phone}
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
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
