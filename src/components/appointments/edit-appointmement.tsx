// src/components/appointments/EditAppointment.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import type { UpdateAppointmentDto } from "../../types/appointments";
import { useAppointments } from "../../hooks/use-appointments";

const EditAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAppointments, updateAppointment, loading } = useAppointments();

  const [formData, setFormData] = useState<UpdateAppointmentDto>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAppointment = async () => {
      if (id) {
        try {
          const response = await getAppointments();
          const appointments = response.data.items || response.data;
          const appointment = Array.isArray(appointments)
            ? appointments.find((a: any) => a.id === id)
            : null;

          if (appointment) {
            setFormData({
              doctorId: appointment.doctorId,
              startAt: appointment.startAt.split(".")[0], // Remove milliseconds
              endAt: appointment.endAt.split(".")[0],
              reason: appointment.reason,
              status: appointment.status,
            });
          }
        } catch (error) {
          console.error("Failed to fetch appointment:", error);
        }
      }
    };

    fetchAppointment();
  }, [id, getAppointments]);

  const handleChange =
    (field: keyof UpdateAppointmentDto) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (formData.startAt && formData.endAt) {
      const start = new Date(formData.startAt);
      const end = new Date(formData.endAt);
      if (end <= start) {
        newErrors.endAt =
          "Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await updateAppointment(id, formData);
        navigate(-1); // Orqaga qaytish
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  if (!formData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              Ortga
            </Button>
            <Typography variant="h4" component="h1">
              Uchrashuvni Tahrirlash
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Doktor ID"
                  value={formData.doctorId || ""}
                  onChange={handleChange("doctorId")}
                  error={!!errors.doctorId}
                  helperText={errors.doctorId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  select
                  value={formData.status || "scheduled"}
                  onChange={handleChange("status")}
                >
                  <MenuItem value="scheduled">Rejalashtirilgan</MenuItem>
                  <MenuItem value="completed">Yakunlangan</MenuItem>
                  <MenuItem value="canceled">Bekor qilingan</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Boshlanish Vaqti"
                  type="datetime-local"
                  value={formData.startAt || ""}
                  onChange={handleChange("startAt")}
                  error={!!errors.startAt}
                  helperText={errors.startAt}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tugash Vaqti"
                  type="datetime-local"
                  value={formData.endAt || ""}
                  onChange={handleChange("endAt")}
                  error={!!errors.endAt}
                  helperText={errors.endAt}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sabab"
                  multiline
                  rows={4}
                  value={formData.reason || ""}
                  onChange={handleChange("reason")}
                  placeholder="Uchrashuv sababini kiriting..."
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                variant="outlined"
                startIcon={<CancelIcon />}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditAppointment;
