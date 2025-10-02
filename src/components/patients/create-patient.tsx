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
  Typography,
} from "@mui/material";
import { api } from "../../service/api";

type Gender = "male" | "female" | "child" | "";

export default function CreatePatientForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

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
        phone,
        notes,
      });

      setMsg(
        `Bemor muvaffaqiyatli qo'shildi: ${data.firstName} ${data.lastName}`
      );
      // Formani tozalash
      setEmail("");
      setFirst("");
      setLast("");
      setGender("");
      setPhone("");
      setNotes("");
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Qo'shishda xatolik yuz berdi");
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
              Yangi bemor qo'shish
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
              label="Telefon raqami"
              fullWidth
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <TextField
              select
              label="Jinsi"
              fullWidth
              margin="normal"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            >
              <MenuItem value="male">Erkak</MenuItem>
              <MenuItem value="female">Ayol</MenuItem>
              <MenuItem value="child">Bola</MenuItem>
            </TextField>

            <TextField
              label="Izoh"
              fullWidth
              margin="normal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={3}
            />

            <Box sx={{ position: "relative", mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ bgcolor: "#769382", "&:hover": { bgcolor: "#5a6a59" } }}
              >
                {loading ? "Qo'shilmoqda..." : "Qo'shish"}
              </Button>

              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "#769382",
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
