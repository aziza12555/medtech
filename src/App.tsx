// src/App.tsx
import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";

// Sahifa komponentlari
import Admin from "./page/admin.tsx";
import Doctor from "./page/doctor.tsx";
import Reception from "./page/reception.tsx";
import Login from "./page/login.tsx";
import ChangePassword from "./page/change-password.tsx";
import { RoleRoute } from "./routes/role-route";
import { AuthRefresh } from "./bootstrap/auth-refresh";
import UserManagementTable from "./components/user/user-management.tsx";
import UserDetail from "./components/user/user-detail.tsx";
import CreateUserForm from "./components/user/create-users.tsx";
import Dashboard from "./page/dashboard.tsx";

import CreatePatient from "./components/patients/create-patient.tsx";
import PatientManagement from "./components/patients/patient-management.tsx";
import PatientDetail from "./components/patients/patient-detail.tsx";
import Sidebar from "./components/sidebar.tsx";
import Navbar from "./components/navbar.tsx";
import { Box } from "@mui/material";

function App() {
  return (
    <AuthRefresh>
      <Routes>
        {/* Asosiy sahifa login sahifasiga yo'naltiriladi */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["admin"]}>
              <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box width={"100%"}>
                  <Navbar />
                  <Outlet />
                </Box>
              </Box>
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<UserManagementTable />} />
          <Route path="user/:id" element={<UserDetail />} />{" "}
          <Route path="patients" element={<PatientManagement />} />
        </Route>

        <Route
          path="/doctor"
          element={
            <RoleRoute roles={["doctor"]}>
              <Doctor />
            </RoleRoute>
          }
        />

        <Route
          path="/reception"
          element={
            <RoleRoute roles={["reception"]}>
              <Reception />
            </RoleRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <RoleRoute roles={["admin", "doctor", "reception"]}>
              <ChangePassword />
            </RoleRoute>
          }
        />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </AuthRefresh>
  );
}

export default App;
