import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "./page/admin.tsx";
import { RoleRoute } from "./routes/role-route";
import { AuthRefresh } from "./bootstrap/auth-refresh";
import Login from "./page/login.tsx";
import Doctor from "./page/doctor.tsx";
import Reception from "./page/reception.tsx";

function App() {
  return (
    <>
      <AuthRefresh>
        <Routes>
          {/* Asosiy sahifani login ga yo'naltirish */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["admin"]}>
                <Admin />
              </RoleRoute>
            }
          />
          
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

          {/* Not found page */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;