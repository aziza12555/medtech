import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import { ProtectedRoute } from './protected-route';

import AdminPanel from '../pages/admin/admin';
import DoctorPanel from '../pages/doctor/doctor';

import UserPage from '../pages/admin/user';

import { SignIn } from '../pages/auth/auth';
import MiniDrawer from '../pages/admin/sidebar';
import { ReceptionPanel } from '../pages/reception/reception';
import DoctorforAdmin from '../pages/doctor/doctorfor-admin';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  

  const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen flex bg-gray-50">
      <MiniDrawer />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Redirect to role-based home */}
      <Route path="/signin" element={<Navigate to={`/${user?.role}`} replace />} />
      <Route path="/" element={<Navigate to={`/${user?.role}`} replace />} />
      <Route path="*" element={<Navigate to={`/${user?.role}`} replace />} />

      {/* admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminPanel />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* admin profil */}
      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <UserPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* reception */}
      <Route
        path="/reception-panel"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
           <ReceptionPanel/>
          </ProtectedRoute>
        }
      />
         <Route
        path="/reception-panel"
        element={
          <ProtectedRoute allowedRoles={['reception']}>
           <ReceptionPanel/>
          </ProtectedRoute>
        }
      />
     

      {/* doctor */}
      <Route
        path="/doctorfor-admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
           <DoctorforAdmin/>
          </ProtectedRoute>
        }
      />
        {/* doctor */}
      <Route
        path="/doctor-panel"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorPanel />
          </ProtectedRoute>
        }
      />

  </Routes>
  
  );
};
