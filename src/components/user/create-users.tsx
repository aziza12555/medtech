import { useState } from "react";
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
} from "@mui/material";

type Role = "admin" | "doctor" | "reception";

export default function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [role, setRole] = useState<Role>("doctor");
  const [temporaryPassword, setTempPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    try {
      const { data } = await api.post("/users", {
        email,
        firstName,
        lastName,
        role,
        temporaryPassword,
      });
      setMsg(`Foydalanuvchi yaratildi: ${data.email}`);
      setEmail("");
      setFirst("");
      setLast("");
      setRole("doctor");
      setTempPass("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 8,
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }} elevation={6}>
        <CardHeader
          title={
            <Typography variant="h5" component="h2" textAlign="center">
              Yangi foydalanuvchi yaratish
            </Typography>
          }
          sx={{ bgcolor: "#769382", color: "white" }}
        />
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Ism"
              fullWidth
              required
              margin="normal"
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
            />

            <TextField
              label="Familiya"
              fullWidth
              required
              margin="normal"
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
            />

            <TextField
              select
              label="Rol"
              fullWidth
              required
              margin="normal"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
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
              value={temporaryPassword}
              onChange={(e) => setTempPass(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
              className="bg-[#769382]"
            >
              {loading ? "Yaratilmoqda..." : "Yaratish"}
            </Button>

            {msg && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {msg}
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
