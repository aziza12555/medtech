// edit-user.tsx - YANGI VERSIYA (alohida page)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
  Alert,
  Breadcrumbs,
  Link,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import { api } from "../../service/api";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "doctor" | "reception";
  status: "Faol" | "Nofaol";
}

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "doctor",
    status: "Faol",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // User ma'lumotlarini olish
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/${id}`);
        setFormData({
          firstName: data.firstName || data.first_name || "",
          lastName: data.lastName || data.last_name || "",
          email: data.email,
          role: data.role,
          status: data.status === "active" ? "Faol" : "Nofaol",
        });
      } catch (error: any) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Foydalanuvchi ma'lumotlarini yuklashda xatolik",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      await api.patch(`/users/${id}`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        role: formData.role,
        status: formData.status === "Faol" ? "active" : "inactive",
      });

      setSnackbar({
        open: true,
        message: "Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi!",
        severity: "success",
      });

      // 2 soniyadan so'ng user detail pagega qaytish
      setTimeout(() => {
        navigate(`/admin/user/${id}`);
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Yangilashda xatolik yuz berdi",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/user/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
      {/* Breadcrumb */}
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
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/admin/user/${id}`)}
          sx={{ cursor: "pointer" }}
        >
          Foydalanuvchi ma'lumotlari
        </Link>
        <Typography color="text.primary">Tahrirlash</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Foydalanuvchi Ma'lumotlarini Tahrirlash
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Kerakli maydonlarni o'zgartiring va "Saqlash" tugmasini bosing
        </Alert>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ism"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Familiya"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={saving}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="reception">Reception</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={saving}
              >
                <MenuItem value="Faol">Faol</MenuItem>
                <MenuItem value="Nofaol">Nofaol</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                  startIcon={<ArrowBack />}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Xabarlar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
