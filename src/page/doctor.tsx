import React, { useState, useEffect } from "react";
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
import { api } from "../service/api";

type Gender = "male" | "female" | "child" | "";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization?: string;
}

export default function CreatePatientForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Doctorlarni yuklash
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Bir nechta endpoint larni tekshirish
        const endpoints = [
          "/doctors",
          "/users/doctors",
          "/users?role=doctor",
          "/staff/doctors",
        ];

        let doctorsData = null;

        for (const endpoint of endpoints) {
          try {
            const { data } = await api.get(endpoint);
            if (data && Array.isArray(data)) {
              doctorsData = data;
              break;
            }
          } catch (e) {
            console.log(`${endpoint} mavjud emas`);
          }
        }

        if (doctorsData) {
          setDoctors(doctorsData);
        } else {
          // Agar hech qanday endpoint ishlamasa, test ma'lumot yaratish
          setDoctors([
            {
              id: "1",
              firstName: "Ali",
              lastName: "Valiyev",
              specialization: "Kardiolog",
            },
            {
              id: "2",
              firstName: "Malika",
              lastName: "Rahimova",
              specialization: "Nevrolog",
            },
            {
              id: "3",
              firstName: "Shavkat",
              lastName: "Qodirov",
              specialization: "Terapevt",
            },
          ]);
        }
      } catch (error) {
        console.error("Doctorlarni yuklashda xatolik:", error);
        setDoctorsError(true);
        // Test ma'lumotlari
        setDoctors([
          {
            id: "1",
            firstName: "Ali",
            lastName: "Valiyev",
            specialization: "Kardiolog",
          },
          {
            id: "2",
            firstName: "Malika",
            lastName: "Rahimova",
            specialization: "Nevrolog",
          },
          {
            id: "3",
            firstName: "Shavkat",
            lastName: "Qodirov",
            specialization: "Terapevt",
          },
        ]);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    // Validatsiya
    if (!firstName || !lastName) {
      setErr("Ism va familiya to'ldirilishi shart");
      return;
    }

    setLoading(true);

    try {
      const patientData: any = {
        email,
        firstName,
        lastName,
        gender,
        phone,
        notes,
      };

      // Agar doctor tanlangan bo'lsa
      if (selectedDoctor) {
        patientData.doctorId = selectedDoctor;
      }

      const { data } = await api.post("/patients", patientData);

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
      setSelectedDoctor("");
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

            {/* Doctor tanlash qismi */}
            <TextField
              select
              label="Doctor"
              fullWidth
              margin="normal"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              disabled={doctorsLoading}
            >
              <MenuItem value="">
                <em>Doctor tanlanmagan</em>
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                  {doctor.specialization && ` - ${doctor.specialization}`}
                </MenuItem>
              ))}
            </TextField>

            {doctorsError && (
              <Typography variant="caption" color="warning.main">
                Test doctor ma'lumotlari ko'rsatilmoqda
              </Typography>
            )}

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
