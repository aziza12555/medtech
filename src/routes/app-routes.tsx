import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authstore'
import Login from '../pages/auth/login'
import { ProtectedRoute } from './protected-route'
import AdminPanel from '../pages/admin/admin'
import DoctorPanel from '../pages/doctor/doctor'
import ReceptionPanel from '../pages/reception/reception'


export const AppRoutes = () => {
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.role)

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={`/${role}`} replace />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception"
        element={
          <ProtectedRoute allowedRoles={['reception']}>
            <ReceptionPanel />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={`/${role}`} replace />} />
      <Route path="*" element={<Navigate to={`/${role}`} replace />} />
    </Routes>
  )
}
