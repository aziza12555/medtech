import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import api from "../../service/api";

export default function CreatePatientForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    try {
      const { data } = await api.post("/patients", {
        email,
        firstName,
        lastName,
        gender,
        notes,
        phone,
      });

      console.log(data);
      setMsg(`Bemor qo'shildi: ${data.firstName} ${data.lastName}`);
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardHeader
          title="Yangi bemor qo'shish"
          sx={{ textAlign: "center", bgcolor: "primary.main", color: "white" }}
        />
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Ism"
              type="text"
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <TextField
              label="Familiya"
              type="text"
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <TextField
              label="Telefon raqami"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              select
              label="Jinsi"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="male">Erkak</MenuItem>
              <MenuItem value="female">Ayol</MenuItem>
              <MenuItem value="child">Bola</MenuItem>
            </TextField>

            <TextField
              label="Izoh"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              margin="normal"
            />

            <Box sx={{ position: "relative", mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                Qo'shish
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "primary.main",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>

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
