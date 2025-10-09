// src/components/CreatePatientForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid,
} from "@mui/material";
import { api } from "../../service/api";
import { useDoctors } from "../../hooks/use-doctors";

type Gender = "male" | "female" | "other" | "";

interface CreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  notes: string;
  doctorId: string;
}

export default function CreatePatientForm() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<CreatePatientData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    notes: "",
    doctorId: "",
  });

  // Doctors hook
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useDoctors();

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Input o'zgarishlari
  const handleInputChange =
    (field: keyof CreatePatientData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Xatoliklarni tozalash
      if (error) setError(null);
      if (message) setMessage(null);
    };

  // Formani yuborish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validatsiya
    if (!formData.firstName.trim()) {
      setError("Ism maydoni to'ldirilishi shart");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Familiya maydoni to'ldirilishi shart");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Telefon raqami maydoni to'ldirilishi shart");
      return;
    }

    if (!formData.doctorId) {
      setError("Doctor tanlash shart");
      return;
    }

    // Telefon raqami validatsiyasi
    const phoneRegex = /^\+?[0-9\s\-\(\)]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Iltimos, to'g'ri telefon raqamini kiriting");
      return;
    }

    // Email validatsiyasi (ixtiyoriy)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Iltimos, to'g'ri email manzilini kiriting");
      return;
    }

    setLoading(true);

    try {
      // API ga so'rov
      const { data } = await api.post("/patients", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        doctorId: formData.doctorId,
      });

      // Muvaffaqiyatli xabar
      setMessage(
        `Bemor muvaffaqiyatli qo'shildi: ${data.firstName} ${data.lastName}`
      );

      // 3 soniyadan so'ng formani tozalash
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          dateOfBirth: "",
          address: "",
          notes: "",
          doctorId: "",
        });
        setMessage(null);

        // Agar kerak bo'lsa, bemorlar ro'yxatiga o'tkazish
        // navigate("/patients");
      }, 3000);
    } catch (err: any) {
      console.error("Bemor qo'shishda xatolik:", err);

      // Xatolik xabarini aniqlash
      let errorMessage = "Bemor qo'shishda xatolik yuz berdi";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code === "NETWORK_ERROR") {
        errorMessage =
          "Serverga ulanib bo'lmadi. Internet aloqasini tekshiring";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Formani tozalash
  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      notes: "",
      doctorId: "",
    });
    setError(null);
    setMessage(null);
  };

  // Orqaga qaytish
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Card elevation={4}>
        <CardHeader
          title={
            <Typography variant="h4" component="h1" fontWeight="bold">
              Yangi Bemor Qo'shish
            </Typography>
          }
          subheader="Bemorning asosiy ma'lumotlarini kiriting"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "& .MuiCardHeader-subheader": {
              color: "rgba(255, 255, 255, 0.8)",
            },
          }}
        />

        <CardContent sx={{ p: 4 }}>
          {/* Doctors loading xatosi */}
          {doctorsError && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {doctorsError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Ism va Familiya */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ism *"
                  fullWidth
                  required
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  disabled={loading}
                  placeholder="Bemorning ismi"
                  error={!!error && !formData.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Familiya *"
                  fullWidth
                  required
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  disabled={loading}
                  placeholder="Bemorning familiyasi"
                  error={!!error && !formData.lastName}
                />
              </Grid>

              {/* Email va Telefon */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  disabled={loading}
                  placeholder="bemor@example.com"
                  error={
                    !!error &&
                    formData.email &&
                    !/\S+@\S+\.\S+/.test(formData.email)
                  }
                  helperText={
                    !!error &&
                    formData.email &&
                    !/\S+@\S+\.\S+/.test(formData.email)
                      ? "Noto'g'ri email formati"
                      : ""
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefon raqami *"
                  fullWidth
                  required
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  disabled={loading}
                  placeholder="+998901234567"
                  error={
                    !!error &&
                    (!formData.phone ||
                      !/^\+?[0-9\s\-\(\)]{7,15}$/.test(formData.phone))
                  }
                  helperText="Format: +998901234567"
                />
              </Grid>

              {/* Tug'ilgan sana va Jins */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tug'ilgan sana"
                  type="date"
                  fullWidth
                  value={formData.dateOfBirth}
                  onChange={handleInputChange("dateOfBirth")}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Jinsi"
                  fullWidth
                  value={formData.gender}
                  onChange={handleInputChange("gender")}
                  disabled={loading}
                >
                  <MenuItem value="">Tanlanmagan</MenuItem>
                  <MenuItem value="male">Erkak</MenuItem>
                  <MenuItem value="female">Ayol</MenuItem>
                  <MenuItem value="other">Boshqa</MenuItem>
                </TextField>
              </Grid>

              {/* Doctor tanlash */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Mas'ul Doctor *"
                  fullWidth
                  required
                  value={formData.doctorId}
                  onChange={handleInputChange("doctorId")}
                  disabled={doctorsLoading || loading}
                  error={!!error && !formData.doctorId}
                  helperText={
                    !!error && !formData.doctorId ? "Doctor tanlash shart" : ""
                  }
                >
                  {doctorsLoading ? (
                    <MenuItem value="">
                      <em>Doctorlar ro'yxati yuklanmoqda...</em>
                    </MenuItem>
                  ) : doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                        {doctor.specialization && ` - ${doctor.specialization}`}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Hech qanday doctor topilmadi
                    </MenuItem>
                  )}
                </TextField>
              </Grid>

              {/* Manzil */}
              <Grid item xs={12}>
                <TextField
                  label="Manzil"
                  fullWidth
                  value={formData.address}
                  onChange={handleInputChange("address")}
                  disabled={loading}
                  multiline
                  rows={2}
                  placeholder="Bemorning yashash manzili"
                />
              </Grid>

              {/* Qo'shimcha ma'lumotlar */}
              <Grid item xs={12}>
                <TextField
                  label="Qo'shimcha ma'lumotlar"
                  fullWidth
                  value={formData.notes}
                  onChange={handleInputChange("notes")}
                  disabled={loading}
                  multiline
                  rows={3}
                  placeholder="Bemor haqida qo'shimcha ma'lumotlar, kasallik tarixi, allergiyalar va boshqalar..."
                />
              </Grid>
            </Grid>

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 4,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
              >
                Orqaga
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                Tozalash
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading || doctorsLoading}
                sx={{ minWidth: 120 }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} color="inherit" />
                    Qo'shilmoqda...
                  </Box>
                ) : (
                  "Bemor Qo'shish"
                )}
              </Button>
            </Box>

            {/* Xabarlar */}
            {message && (
              <Alert
                severity="success"
                sx={{ mt: 3 }}
                onClose={() => setMessage(null)}
              >
                {message}
              </Alert>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
