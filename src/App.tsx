// src/App.tsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Sahifa komponentlari
import Admin from "./page/admin.tsx";
import Doctor from "./page/doctor.tsx";
import Reception from "./page/reception.tsx";
import Login from "./page/login.tsx";
import ChangePassword from "./page/change-password.tsx";

// Xavfsizlik va autentifikatsiya uchun wrapperlar
import { RoleRoute } from "./routes/role-route";
import { AuthRefresh } from "./bootstrap/auth-refresh";
import UserManagementTable from "./components/user/user-management.tsx";
import UserDetail from "./components/user/user-detail.tsx";
import CreateUserForm from "./components/user/create-users.tsx";
import Dashboard from "./page/dashboard.tsx";
import PatientManagement from "./components/patients/patient-management.tsx";
import PatientDetail from "./components/patients/patient-detail.tsx";
import CreatePatient from "./components/patients/create-patient.tsx";

function App() {
  return (
    <AuthRefresh>
      <Routes>
        {/* Asosiy sahifa login sahifasiga yo'naltiriladi */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login sahifasi */}
        <Route path="/login" element={<Login />} />

        {/* Admin uchun sahifalar */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["admin"]}>
              <Admin />
            </RoleRoute>
          }
        />

        {/* Doctor uchun sahifa */}
        <Route
          path="/doctor"
          element={
            <RoleRoute roles={["doctor"]}>
              <Doctor />
            </RoleRoute>
          }
        />

        {/* Reception uchun sahifa */}
        <Route
          path="/reception"
          element={
            <RoleRoute roles={["reception"]}>
              <Reception />
            </RoleRoute>
          }
        />

        {/* Parolni o'zgartirish sahifasi barcha rolga ochiq */}
        <Route
          path="/change-password"
          element={
            <RoleRoute roles={["admin", "doctor", "reception"]}>
              <ChangePassword />
            </RoleRoute>
          }
        />

        {/* Faqat admin uchun Create User sahifasi */}
        <Route
          path="/user"
          element={
            <RoleRoute roles={["admin"]}>
              <UserManagementTable />
            </RoleRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <RoleRoute roles={["admin"]}>
              <UserDetail />
            </RoleRoute>
          }
        />
        <Route
          path="/user/create"
          element={
            <RoleRoute roles={["admin"]}>
              <CreateUserForm />
            </RoleRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <RoleRoute roles={["admin"]}>
              <PatientManagement />
            </RoleRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <RoleRoute roles={["admin"]}>
              <PatientDetail />
            </RoleRoute>
          }
        />
        <Route
          path="/patient/create"
          element={
            <RoleRoute roles={["admin"]}>
              <CreatePatient />
            </RoleRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RoleRoute roles={["admin"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </AuthRefresh>
  );
}

export default App;
