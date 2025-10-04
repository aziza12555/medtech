import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { api } from "../../service/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "doctor" | "reception";
  status: "Faol" | "Nofaol";
  createdAt: string;
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Form uchun state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "" as User["role"],
    status: "" as User["status"],
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<User>(`/users/${id}`);
        setUser(data);
        // Formni to'ldirish
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          status: data.status,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Foydalanuvchini yangilash uchun PUT yoki PATCH so'rovi (serveringizga qarab)
      await api.patch(`/users/${user.id}`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        role: formData.role,
        status: formData.status === "Faol" ? "active" : "inactive",
      });

      setUser({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });

      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Ma'lumotlar muvaffaqiyatli yangilandi!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Yangilashda xatolik yuz berdi.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
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
          onClick={() => navigate("/user")}
          sx={{ mt: 2 }}
        >
          Orqaga
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {editMode
          ? "Foydalanuvchini tahrirlash"
          : `${user.firstName} ${user.lastName}`}
      </Typography>

      {editMode ? (
        <>
          <TextField
            label="Ism"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Familiya"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-label">Rol</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              label="Rol"
              onChange={handleSelectChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="reception">Reception</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
            >
              <MenuItem value="Faol">Faol</MenuItem>
              <MenuItem value="Nofaol">Nofaol</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              Saqlash
            </Button>
            <Button
              variant="outlined"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              Bekor qilish
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography>
            <strong>Rol:</strong> {user.role}
          </Typography>
          <Typography>
            <strong>Status:</strong> {user.status}
          </Typography>
          <Typography>
            <strong>Yaratilgan sanasi:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 3 }}
            onClick={() => setEditMode(true)}
          >
            Tahrirlash
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 3, ml: 2 }}
            onClick={() => navigate("/user")}
          >
            Orqaga
          </Button>
        </>
      )}

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
