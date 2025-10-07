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
  Grid,
} from "@mui/material";

import { api } from "../../service/api";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization?: string;
}

interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status?: AppointmentStatus;
  reason?: string;
}

export default function CreateAppointmentForm() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [startAt, setStartAt] = useState<Date | null>(new Date());
  const [endAt, setEndAt] = useState<Date | null>(
    new Date(Date.now() + 30 * 60 * 1000)
  );
  const [reason, setReason] = useState("");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Patientlarni yuklash
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get("/patients");
        setPatients(data);
      } catch (error: any) {
        console.error("Patientlarni yuklashda xatolik:", error);
        setErr(
          error?.response?.data?.message || "Patientlarni yuklab bo'lmadi"
        );

        // Fallback test ma'lumotlari
        setPatients([
          {
            id: "1",
            firstName: "Ali",
            lastName: "Valiyev",
            phone: "+998901234567",
          },
          {
            id: "2",
            firstName: "Malika",
            lastName: "Rahimova",
            phone: "+998901234568",
          },
        ]);
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Doctorlarni yuklash
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get("/doctors");
        setDoctors(data);
      } catch (error: any) {
        console.error("Doctorlarni yuklashda xatolik:", error);
        setErr(error?.response?.data?.message || "Doctorlarni yuklab bo'lmadi");

        // Fallback test ma'lumotlari
        setDoctors([
          {
            id: "1",
            firstName: "Shavkat",
            lastName: "Qodirov",
            specialization: "Terapevt",
          },
          {
            id: "2",
            firstName: "Dilfuza",
            lastName: "Xolmatova",
            specialization: "Pediatr",
          },
        ]);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // EndAt ni avtomatik hisoblash (30 minut)
  useEffect(() => {
    if (startAt) {
      const endTime = new Date(startAt.getTime() + 30 * 60 * 1000);
      setEndAt(endTime);
    }
  }, [startAt]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    // Validatsiya
    const errors: string[] = [];

    if (!selectedPatient) errors.push("Bemor tanlanishi shart");
    if (!selectedDoctor) errors.push("Doctor tanlanishi shart");
    if (!startAt) errors.push("Boshlanish vaqti tanlanishi shart");
    if (!endAt) errors.push("Tugash vaqti tanlanishi shart");
    if (startAt && endAt && startAt >= endAt) {
      errors.push("Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak");
    }

    if (errors.length > 0) {
      setErr(errors.join(", "));
      return;
    }

    setLoading(true);

    try {
      const appointmentData: CreateAppointmentData = {
        patientId: selectedPatient,
        doctorId: selectedDoctor,
        startAt: startAt!.toISOString(),
        endAt: endAt!.toISOString(),
        status: status,
        reason: reason || undefined, // Empty string ni undefined ga aylantiramiz
      };

      console.log("Yuborilayotgan ma'lumotlar:", appointmentData);

      const { data } = await api.post("/appointments", appointmentData);

      setMsg(
        `✅ Uchrashuv muvaffaqiyatli yaratildi! 
        Sana: ${format(new Date(data.startAt), "dd.MM.yyyy HH:mm")}
        Bemor: ${data.patient?.firstName} ${data.patient?.lastName}
        Doctor: ${data.doctor?.firstName} ${data.doctor?.lastName}`
      );

      // Formani tozalash
      setSelectedPatient("");
      setSelectedDoctor("");
      setStartAt(new Date());
      setEndAt(new Date(Date.now() + 30 * 60 * 1000));
      setReason("");
    } catch (error: any) {
      console.error("Xatolik detallari:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Uchrashuv yaratishda xatolik yuz berdi";

      setErr(`❌ ${errorMessage}`);

      // Validation xatoliklarini ko'rsatish
      if (error?.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const validationMessages = Object.values(validationErrors)
          .flat()
          .join(", ");
        setErr(`❌ ${validationMessages}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          px: 2,
          pb: 4,
        }}
      >
        <Card sx={{ maxWidth: 800, width: "100%" }} elevation={6}>
          <CardHeader
            title={
              <Typography
                variant="h5"
                component="h2"
                textAlign="center"
                fontWeight="bold"
              >
                🗓️ Yangi Uchrashuv Yaratish
              </Typography>
            }
            sx={{
              bgcolor: "primary.main",
              color: "white",
              py: 3,
            }}
          />
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={onSubmit} noValidate>
              <Grid container spacing={3}>
                {/* Bemor tanlash */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Bemor *"
                    fullWidth
                    required
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    disabled={patientsLoading}
                    error={!selectedPatient && !!err}
                    helperText={!selectedPatient && "Bemor tanlanishi shart"}
                  >
                    {patientsLoading ? (
                      <MenuItem value="">
                        <em>Bemorlar yuklanmoqda...</em>
                      </MenuItem>
                    ) : (
                      <>
                        <MenuItem value="">
                          <em>Bemorni tanlang</em>
                        </MenuItem>
                        {patients.map((patient) => (
                          <MenuItem key={patient.id} value={patient.id}>
                            👤 {patient.firstName} {patient.lastName}
                            {patient.phone && ` (${patient.phone})`}
                          </MenuItem>
                        ))}
                      </>
                    )}
                  </TextField>
                </Grid>

                {/* Doctor tanlash */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Doctor *"
                    fullWidth
                    required
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    disabled={doctorsLoading}
                    error={!selectedDoctor && !!err}
                    helperText={!selectedDoctor && "Doctor tanlanishi shart"}
                  >
                    {doctorsLoading ? (
                      <MenuItem value="">
                        <em>Doctorlar yuklanmoqda...</em>
                      </MenuItem>
                    ) : (
                      <>
                        <MenuItem value="">
                          <em>Doctorni tanlang</em>
                        </MenuItem>
                        {doctors.map((doctor) => (
                          <MenuItem key={doctor.id} value={doctor.id}>
                            🩺 {doctor.firstName} {doctor.lastName}
                            {doctor.specialization &&
                              ` - ${doctor.specialization}`}
                          </MenuItem>
                        ))}
                      </>
                    )}
                  </TextField>
                </Grid>

                {/* Uchrashuv boshlanish vaqti */}
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="Boshlanish vaqti *"
                    value={startAt}
                    onChange={(newValue) => setStartAt(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !startAt && !!err,
                        helperText:
                          !startAt && "Boshlanish vaqti tanlanishi shart",
                      },
                    }}
                  />
                </Grid>

                {/* Uchrashuv tugash vaqti */}
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="Tugash vaqti *"
                    value={endAt}
                    onChange={(newValue) => setEndAt(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error:
                          (!endAt || (startAt && endAt && startAt >= endAt)) &&
                          !!err,
                        helperText: !endAt
                          ? "Tugash vaqti tanlanishi shart"
                          : startAt && endAt && startAt >= endAt
                          ? "Tugash vaqti boshlanishdan keyin bo'lishi kerak"
                          : "",
                      },
                    }}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Holat"
                    fullWidth
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as AppointmentStatus)
                    }
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Uchrashuv sababi */}
                <Grid item xs={12}>
                  <TextField
                    label="Uchrashuv sababi"
                    fullWidth
                    multiline
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Bemorning shikoyati, tekshiruv turi yoki qo'shimcha ma'lumotlar..."
                  />
                </Grid>
              </Grid>

              {/* Submit button */}
              <Box sx={{ position: "relative", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  {loading ? "⏳ Yaratalmoqda..." : "✅ Uchrashuv Yaratish"}
                </Button>

                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>

              {/* Xabarlar */}
              {msg && (
                <Alert severity="success" sx={{ mt: 3 }} icon={false}>
                  <Typography whiteSpace="pre-line">{msg}</Typography>
                </Alert>
              )}

              {err && (
                <Alert severity="error" sx={{ mt: 3 }} icon={false}>
                  <Typography>{err}</Typography>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
