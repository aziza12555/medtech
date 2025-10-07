// components/appointments/AppointmentManagement.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import { Add, Refresh, Schedule, Check, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
  status: "scheduled" | "completed" | "canceled";
  reason?: string;
  patient: { firstName: string; lastName: string };
  doctor: { firstname: string; lastname: string };
}

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data.items || data || []);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "primary",
      completed: "success",
      canceled: "error",
    };
    return colors[status as keyof typeof colors] || "default";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      scheduled: <Schedule />,
      completed: <Check />,
      canceled: <Cancel />,
    };
    return icons[status as keyof typeof icons];
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("uz-UZ", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ color: "#769382", fontWeight: "bold", mb: 1 }}
          >
            Uchrashuvlar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Barcha rejalashtirilgan uchrashuvlar
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAppointments}
            disabled={loading}
          >
            Yangilash
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/admin/appointments/create")}
            sx={{ bgcolor: "#769382", "&:hover": { bgcolor: "#5a7a6a" } }}
          >
            Yangi Uchrashuv
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {["scheduled", "completed", "canceled"].map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h3" sx={{ color: "#769382", mb: 1 }}>
                {appointments.filter((a) => a.status === status).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {status === "scheduled"
                  ? "Rejalashtirilgan"
                  : status === "completed"
                  ? "Bajarilgan"
                  : "Bekor qilingan"}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Appointments List */}
      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} md={6} lg={4} key={appointment.id}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
              }}
              onClick={() => navigate(`/admin/appointments/${appointment.id}`)}
            >
              <CardContent>
                {/* Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Chip
                    icon={getStatusIcon(appointment.status)}
                    label={
                      appointment.status === "scheduled"
                        ? "Rejalashtirilgan"
                        : appointment.status === "completed"
                        ? "Bajarilgan"
                        : "Bekor qilingan"
                    }
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(appointment.startAt)}
                  </Typography>
                </Box>

                {/* Patient & Doctor */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {appointment.patient.firstName}{" "}
                    {appointment.patient.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shifokor: {appointment.doctor.firstname}{" "}
                    {appointment.doctor.lastname}
                  </Typography>
                </Box>

                {/* Reason */}
                {appointment.reason && (
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", color: "#666" }}
                  >
                    "{appointment.reason}"
                  </Typography>
                )}

                {/* Duration */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block" }}
                >
                  {formatDateTime(appointment.startAt)} -{" "}
                  {formatDateTime(appointment.endAt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {appointments.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Schedule sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Hozircha uchrashuvlar mavjud emas
          </Typography>
        </Box>
      )}
    </Box>
  );
}
