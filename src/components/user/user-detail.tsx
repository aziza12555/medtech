// user-detail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Edit, Delete, ArrowBack, Home } from "@mui/icons-material";
import { api } from "../../service/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "doctor" | "reception";
  status: "Faol" | "Nofaol";
  createdAt: string;
  updatedAt?: string;
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        console.log("🔍 UserDetail: API so'rov boshlandi, ID:", id);

        const { data } = await api.get(`/users/${id}`);
        console.log("✅ UserDetail API javobi:", data);

        // ✅ Backend formatini frontend formatiga o'tkazish
        const userData: User = {
          id: data.id,
          email: data.email,
          firstName: data.first_name || data.firstName || "", // ✅ Ikkala formatni ham tekshiramiz
          lastName: data.last_name || data.lastName || "", // ✅ Ikkala formatni ham tekshiramiz
          role: data.role,
          status: data.status === "active" ? "Faol" : "Nofaol", // ✅ Statusni o'zgartiramiz
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        console.log("🔄 Transform qilingan user:", userData);
        setUser(userData);
      } catch (error: any) {
        console.error("❌ UserDetail xatolik:", error);
        console.error("❌ Xatolik ma'lumoti:", error.response?.data);

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

  const handleDelete = async () => {
    if (!user) return;
    const confirm = window.confirm(
      `"${user.firstName} ${user.lastName}" foydalanuvchisini o'chirishni istaysizmi?`
    );
    if (!confirm) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/users/${user.id}`);
      setSnackbar({
        open: true,
        message: "Foydalanuvchi muvaffaqiyatli o'chirildi!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/user"), 1500);
    } catch (error: any) {
      console.error("O'chirish xatosi:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "O'chirishda xatolik yuz berdi",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "doctor":
        return "primary";
      case "reception":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Faol" ? "success" : "error";
  };

  // ✅ Debug uchun ma'lumotlarni tekshirish
  useEffect(() => {
    if (user) {
      console.log("User ma'lumotlari:", user);
    }
  }, [user]);

  if (loading && !user)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );

  if (!user)
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Foydalanuvchi topilmadi</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin/user")}
          sx={{ mt: 2 }}
        >
          Foydalanuvchilar ro'yxatiga qaytish
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
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
        <Typography color="text.primary">
          {user.firstName} {user.lastName} {/* ✅ To'g'ri property nomlari */}
        </Typography>
      </Breadcrumbs>

      {/* Sarlavha va tugmalar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Foydalanuvchi Ma'lumotlari
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/admin/user/${user.id}/edit`)}
            size="small"
          >
            Tahrirlash
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            disabled={deleteLoading}
            size="small"
          >
            {deleteLoading ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/user")}
            size="small"
          >
            Orqaga
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
              >
                👤 Asosiy Ma'lumotlar
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  To'liq Ismi
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {user.firstName} {user.lastName}{" "}
                  {/* ✅ To'g'ri property nomlari */}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Email Manzili
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontFamily: "monospace" }}
                >
                  {user.email}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Rol
                </Typography>
                <Chip
                  label={user.role.toUpperCase()}
                  color={getRoleColor(user.role)}
                  size="medium"
                  sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Status
                </Typography>
                <Chip
                  label={user.status}
                  color={getStatusColor(user.status)}
                  size="medium"
                  sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
              >
                ⚙️ Tizim Ma'lumotlari
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Yaratilgan Sana
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: "medium" }}
                >
                  {new Date(user.createdAt).toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>

              {user.updatedAt && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Yangilangan Sana
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "medium" }}
                  >
                    {new Date(user.updatedAt).toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Foydalanuvchi ID
                </Typography>
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  sx={{
                    bgcolor: "grey.100",
                    p: 1,
                    borderRadius: 1,
                    wordBreak: "break-all",
                  }}
                >
                  {user.id}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
