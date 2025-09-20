import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authstore'

type UserRole = 'admin' | 'doctor' | 'reception'

// Misol uchun ro'yxatdan o'tgan foydalanuvchilar
const mockUsers: Record<string, { password: string; role: UserRole }> = {
  'admin@example.com': { password: 'admin123', role: 'admin' },
  'doctor@example.com': { password: 'doctor123', role: 'doctor' },
  'reception@example.com': { password: 'reception123', role: 'reception' },
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const handleLogin = () => {
    setLoading(true)

    setTimeout(() => {
      const user = mockUsers[email.toLowerCase()]
      if (user && user.password === password) {
        const fakeToken = 'fake-token-' + Math.random().toString(36).substring(2)
        setAuth(fakeToken, user.role)
        navigate('/') // asosiy sahifaga yo'naltirish
      } else {
        alert('Email yoki parol noto‘g‘ri')
      }
      setLoading(false)
    }, 1000) // Simulyatsiya uchun kechikish
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign in to MedTech
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          label="Parol"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Kirish'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
