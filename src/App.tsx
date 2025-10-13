// App.tsx - TO'LIQ TO'G'RILANGAN VERSIYA
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
import AppointmentsList from "./components/appointments/appointment-list";
import CreateAppointment from "./components/appointments/create-appointment";

function App() {
  return (
    <AuthRefresh>
      <Routes>
        {/* Asosiy yo'naltirish */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin paneli - BARCHA HUQUQLAR */}
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

          {/* User boshqaruvi - FAQAT ADMIN */}
          <Route path="users">
            <Route index element={<UserManagementTable />} />
            <Route path="create" element={<CreateUserForm />} />
            <Route path=":id" element={<UserDetail />} />
            <Route path=":id/edit" element={<EditUser />} />
          </Route>

          {/* Patient boshqaruvi - FAQAT ADMIN */}
          <Route path="patients">
            <Route index element={<PatientManagement />} />
            <Route path="create" element={<CreatePatientForm />} />
            <Route path=":id" element={<PatientDetail />} />
          </Route>

          {/* Appointments boshqaruvi - FAQAT ADMIN */}
          <Route path="appointments">
            <Route index element={<AppointmentsList />} />
            <Route path="create" element={<CreateAppointment />} />
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

        {/* Doctor paneli - FAQAT O'ZI KERAKLI HUQUQLAR */}
        <Route
          path="/doctor"
          element={
            <RoleRoute roles={["doctor"]}>
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
          <Route path="dashboard" element={<Doctor />} />

          {/* Doctor uchun appointments - FAQAT KO'RISH VA STATUS O'ZGARTIRISH */}
          <Route path="appointments">
            <Route index element={<AppointmentsList />} />
            {/* DOCTOR UCHUN CREATE VA EDIT O'CHIRILDI */}
          </Route>

          {/* DOCTOR UCHUN PATIENTS ROUTE LARI O'CHIRILDI - Doctor bemor qo'sha olmaydi */}
        </Route>

        {/* Reception paneli - FAQAT O'ZI KERAKLI HUQUQLAR */}
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
                    <Outlet />
                  </Box>
                </Box>
              </Box>
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Reception />} />

          {/* Reception uchun appointments - FAQAT CREATE VA KO'RISH */}
          <Route path="appointments">
            <Route index element={<AppointmentsList />} />
            <Route path="create" element={<CreateAppointment />} />
            {/* RECEPTION UCHUN EDIT O'CHIRILDI - Reception uchrashuvni tahrirlay olmaydi */}
          </Route>

          {/* Reception uchun patients - FAQAT CREATE VA KO'RISH */}
          <Route path="patients">
            <Route index element={<PatientManagement />} />
            <Route path="create" element={<CreatePatientForm />} />
            <Route path=":id" element={<PatientDetail />} />
            {/* RECEPTION UCHUN EDIT O'CHIRILDI - Reception bemor ma'lumotlarini tahrirlay olmaydi */}
          </Route>
        </Route>

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

        {/* Unauthorized sahifa */}
        <Route
          path="/unauthorized"
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
              <h1 style={{ fontSize: "4rem", margin: 0, color: "#ff6b6b" }}>
                403
              </h1>
              <h2 style={{ margin: "1rem 0" }}>Ruxsat etilmagan</h2>
              <p style={{ marginBottom: "2rem", color: "#666" }}>
                Sizda ushbu sahifaga kirish uchun ruxsat yo'q.
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
