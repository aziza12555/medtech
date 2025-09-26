import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Patients from '../pages/reception/patients';
import { useAuthStore } from '../store/auth-store';
import { Navbar } from '../pages/shared/navbar';
import { SignIn } from '../pages/auth/auth';
import { ProtectedRoute } from './protected-route';
import AdminPanel from '../pages/admin/admin';
import DoctorPanel from '../pages/doctor/doctor';
import { ReceptionPanel } from '../pages/reception/reception';
import UserPage from '../pages/admin/user';
import MiniDrawer from '../pages/admin/sidebar';
import DoctorforAdmin from '../pages/doctor/doctorfor-admin';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user, fetchMe, isLoading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // drawer state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen flex bg-gray-50">
      <MiniDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <div className="flex flex-col flex-1">
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/signin" element={<Navigate to={`/${user?.role}`} replace />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
         <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserPage/>
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
          path="/doctorfor-admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DoctorforAdmin/>
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
        <Route path="/" element={<Navigate to={`/${user?.role}`} replace />} />
        <Route path="*" element={<Navigate to={`/${user?.role}`} replace />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Layout>
  );
};
