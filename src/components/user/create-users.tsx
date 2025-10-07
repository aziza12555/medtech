import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";

type Role = "admin" | "doctor" | "reception";

export default function CreateUserForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "doctor" as Role,
    temporaryPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    // ✅ Validatsiya
    if (formData.firstName.length < 2) {
      setErr("Ism kamida 2 ta belgidan iborat bo'lishi kerak");
      return;
    }

    if (formData.lastName.length < 2) {
      setErr("Familiya kamida 2 ta belgidan iborat bo'lishi kerak");
      return;
    }

    if (formData.temporaryPassword.length < 8) {
      setErr("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);

    try {
      // ✅ Backendga to'g'ri formatda yuborish
      const { data } = await api.post("/users", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        temporaryPassword: formData.temporaryPassword,
      });

      setMsg(`Foydalanuvchi muvaffaqiyatli yaratildi: ${data.email}`);

      // 3 soniyadan so'ng ro'yxatga qaytish
      setTimeout(() => {
        navigate("/admin/user");
      }, 3000);
    } catch (e: any) {
      console.error("Yaratish xatosi:", e.response?.data);
      setErr(e?.response?.data?.message || "Foydalanuvchi yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/user");
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: "0 auto" }}>
      {/* Breadcrumb navigatsiya */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/admin/dashboard")}
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/admin/user")}
          sx={{ cursor: "pointer" }}
        >
          Foydalanuvchilar
        </Link>
        <Typography color="text.primary">Yangi foydalanuvchi</Typography>
      </Breadcrumbs>

      <Card elevation={6}>
        <CardHeader
          title={
            <Typography variant="h4" component="h1" textAlign="center">
              Yangi Foydalanuvchi Yaratish
            </Typography>
          }
          sx={{
            bgcolor: "#769382",
            color: "white",
            py: 3,
          }}
        />
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={onSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={loading}
              helperText="Foydalanuvchi email manzili"
              error={!!err && err.includes("email")}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Ism"
                fullWidth
                required
                margin="normal"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={loading}
                helperText="Kamida 2 ta belgi"
                error={!!err && err.includes("Ism")}
                inputProps={{ minLength: 2 }}
              />

              <TextField
                label="Familiya"
                fullWidth
                required
                margin="normal"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={loading}
                helperText="Kamida 2 ta belgi"
                error={!!err && err.includes("Familiya")}
                inputProps={{ minLength: 2 }}
              />
            </Box>

            <TextField
              select
              label="Rol"
              fullWidth
              required
              margin="normal"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              disabled={loading}
              helperText="Foydalanuvchi roli"
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="reception">Reception</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              label="Vaqtinchalik parol"
              type="password"
              fullWidth
              required
              margin="normal"
              value={formData.temporaryPassword}
              onChange={(e) =>
                handleChange("temporaryPassword", e.target.value)
              }
              disabled={loading}
              helperText="Kamida 8 ta belgi"
              error={!!err && err.includes("Parol")}
              inputProps={{ minLength: 8 }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={handleCancel}
                disabled={loading}
                startIcon={<ArrowBack />}
              >
                Bekor qilish
              </Button>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: "#769382",
                  "&:hover": {
                    bgcolor: "#5a7a6a",
                  },
                }}
              >
                {loading ? "Yaratilmoqda..." : "Yaratish"}
              </Button>
            </Box>

            {msg && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {msg}
                <br />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Foydalanuvchilar ro'yxatiga yo'naltirilmoqda...
                </Typography>
              </Alert>
            )}

            {err && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {err}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
