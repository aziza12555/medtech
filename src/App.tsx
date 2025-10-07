import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Login from "./page/login";
import { RoleRoute } from "./routes/role-route";
import Sidebar from "./components/sidebar";
import Dashboard from "./page/dashboard";
import UserManagementTable from "./components/user/user-management";
import CreateUserForm from "./components/user/create-users";
import UserDetail from "./components/user/user-detail";
import EditUser from "./components/user/edit-user";
import PatientManagement from "./components/patients/patient-management";
import CreatePatientForm from "./components/patients/create-patient";
import PatientDetail from "./components/patients/patient-detail";
import Doctor from "./page/doctor";
import Reception from "./page/reception";
import ChangePassword from "./page/change-password";
import Navbar from "./components/navbar";
import { AuthRefresh } from "./bootstrap/auth-refresh";
import AppointmentManagement from "./components/appointments/appointment-management";
import CreateAppointmentForm from "./components/appointments/create-appointment";

function App() {
  return (
    <AuthRefresh>
      <Routes>
        {/* Asosiy yo'naltirish */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin paneli */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["admin"]}>
              <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <Box
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Navbar />
                  <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}
                  >
                    <Outlet />
                  </Box>
                </Box>
              </Box>
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* User boshqaruvi */}
          <Route path="user">
            <Route index element={<UserManagementTable />} />
            <Route path="create" element={<CreateUserForm />} />
            <Route path=":id" element={<UserDetail />} />
            <Route path=":id/edit" element={<EditUser />} />
          </Route>

          {/* Patient boshqaruvi */}
          <Route path="patients">
            <Route index element={<PatientManagement />} />
            <Route path="create" element={<CreatePatientForm />} />
            <Route path=":id" element={<PatientDetail />} />
          </Route>

          {/* Page not found admin uchun */}
          <Route
            path="*"
            element={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <h1>404 - Sahifa topilmadi</h1>
                  <p>Admin panelida so'ralgan sahifa mavjud emas.</p>
                </div>
              </Box>
            }
          />
        </Route>

        {/* Doctor paneli */}
        <Route
          path="/doctor"
          element={
            <RoleRoute roles={["doctor"]}>
              <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Box
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Navbar />
                  <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}
                  >
                    <Doctor />
                  </Box>
                </Box>
              </Box>
            </RoleRoute>
          }
        />

        <Route path="/create-appointment" element={<CreateAppointmentForm />} />

        {/* Reception paneli */}
        <Route
          path="/reception"
          element={
            <RoleRoute roles={["reception"]}>
              <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <Box
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Navbar />
                  <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}
                  >
                    <Reception />
                  </Box>
                </Box>
              </Box>
            </RoleRoute>
          }
        />

        {/* Parolni o'zgartirish (barcha rollar uchun) */}
        <Route
          path="/change-password"
          element={
            <RoleRoute roles={["admin", "doctor", "reception"]}>
              <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <Box
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Navbar />
                  <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}
                  >
                    <ChangePassword />
                  </Box>
                </Box>
              </Box>
            </RoleRoute>
          }
        />

        {/* Global 404 sahifa */}
        <Route
          path="*"
          element={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <h1 style={{ fontSize: "4rem", margin: 0, color: "#1976d2" }}>
                404
              </h1>
              <h2 style={{ margin: "1rem 0" }}>Sahifa topilmadi</h2>
              <p style={{ marginBottom: "2rem", color: "#666" }}>
                So'ralgan sahifa mavjud emas. Iltimos, manzilni tekshiring yoki
                bosh sahifaga qayting.
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Login sahifasiga qaytish
              </button>
            </Box>
          }
        />
      </Routes>
    </AuthRefresh>
  );
}

export default App;
