// src/components/CreateAppointment.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAppointments } from "../../hooks/use-appointments";
import type { CreateAppointmentDto } from "../../types/appointments";

const steps = ["Asosiy ma'lumotlar", "Qo'shimcha ma'lumotlar", "Tasdiqlash"];

const CreateAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { createAppointment, loading } = useAppointments();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateAppointmentDto>({
    patientId: "",
    doctorId: "",
    startAt: "",
    endAt: "",
    status: "scheduled",
    reason: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange =
    (field: keyof CreateAppointmentDto) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      if (!formData.patientId.trim()) {
        newErrors.patientId = "Bemor ID kiritilishi shart";
      }
      if (!formData.doctorId.trim()) {
        newErrors.doctorId = "Doktor ID kiritilishi shart";
      }
      if (!formData.startAt) {
        newErrors.startAt = "Boshlanish vaqti kiritilishi shart";
      }
      if (!formData.endAt) {
        newErrors.endAt = "Tugash vaqti kiritilishi shart";
      }
    }

    if (formData.startAt && formData.endAt) {
      const start = new Date(formData.startAt);
      const end = new Date(formData.endAt);
      if (end <= start) {
        newErrors.endAt =
          "Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await createAppointment(formData);
      navigate("/appointments");
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bemor ID"
                value={formData.patientId}
                onChange={handleChange("patientId")}
                error={!!errors.patientId}
                helperText={errors.patientId}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Doktor ID"
                value={formData.doctorId}
                onChange={handleChange("doctorId")}
                error={!!errors.doctorId}
                helperText={errors.doctorId}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Boshlanish Vaqti"
                type="datetime-local"
                value={formData.startAt}
                onChange={handleChange("startAt")}
                error={!!errors.startAt}
                helperText={errors.startAt}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tugash Vaqti"
                type="datetime-local"
                value={formData.endAt}
                onChange={handleChange("endAt")}
                error={!!errors.endAt}
                helperText={errors.endAt}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status"
                select
                value={formData.status}
                onChange={handleChange("status")}
              >
                <MenuItem value="scheduled">Rejalashtirilgan</MenuItem>
                <MenuItem value="completed">Yakunlangan</MenuItem>
                <MenuItem value="canceled">Bekor qilingan</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sabab (ixtiyoriy)"
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleChange("reason")}
                placeholder="Uchrashuv sababini kiriting..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Uchrashuv ma'lumotlari
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Bemor ID:
                </Typography>
                <Typography variant="body1">{formData.patientId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Doktor ID:
                </Typography>
                <Typography variant="body1">{formData.doctorId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Boshlanish Vaqti:
                </Typography>
                <Typography variant="body1">
                  {new Date(formData.startAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tugash Vaqti:
                </Typography>
                <Typography variant="body1">
                  {new Date(formData.endAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status:
                </Typography>
                <Typography variant="body1" textTransform="capitalize">
                  {formData.status}
                </Typography>
              </Grid>
              {formData.reason && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Sabab:
                  </Typography>
                  <Typography variant="body1">{formData.reason}</Typography>
                </Grid>
              )}
            </Grid>

            <Alert severity="info" sx={{ mt: 2 }}>
              Ma'lumotlarni tekshiring. Tasdiqlaganingizdan so'ng uchrashuv
              yaratiladi.
            </Alert>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/appointments")}
              sx={{ mr: 2 }}
            >
              Ortga
            </Button>
            <Typography variant="h4" component="h1">
              Yangi Uchrashuv
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2 }}>{getStepContent(activeStep)}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              startIcon={<CancelIcon />}
            >
              Ortga
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => navigate("/appointments")}
                variant="outlined"
                disabled={loading}
              >
                Bekor qilish
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                >
                  {loading ? "Yaratilmoqda..." : "Yaratish"}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Keyingi
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateAppointment;
