// src/components/appointments/ViewAppointment.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import type { Appointment } from "../../types/appointments";
import { useAppointments } from "../../hooks/use-appointments";

const ViewAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAppointments } = useAppointments();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (id) {
        try {
          const response = await getAppointments();
          const appointments = response.data.items || response.data;
          const foundAppointment = Array.isArray(appointments)
            ? appointments.find((a: any) => a.id === id)
            : null;

          setAppointment(foundAppointment || null);
        } catch (error) {
          console.error("Failed to fetch appointment:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointment();
  }, [id, getAppointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "primary";
      case "completed":
        return "success";
      case "canceled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Rejalashtirilgan";
      case "completed":
        return "Yakunlangan";
      case "canceled":
        return "Bekor qilingan";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Uchrashuv topilmadi
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mr: 2 }}
              >
                Ortga
              </Button>
              <Typography variant="h4" component="h1">
                Uchrashuv Ma'lumotlari
              </Typography>
            </Box>

            <Button
              startIcon={<EditIcon />}
              onClick={() => navigate(`edit`)}
              variant="outlined"
            >
              Tahrirlash
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Status */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Chip
                  label={getStatusText(appointment.status)}
                  color={getStatusColor(appointment.status) as any}
                  size="large"
                />
              </Box>
            </Grid>

            {/* Vaqt ma'lumotlari */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Vaqt Ma'lumotlari</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Boshlanish Vaqti:
                    </Typography>
                    <Typography variant="body1">
                      {format(
                        new Date(appointment.startAt),
                        "dd.MM.yyyy HH:mm"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Tugash Vaqti:
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(appointment.endAt), "dd.MM.yyyy HH:mm")}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Bemor ma'lumotlari */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Bemor</Typography>
                </Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Ism Familiya:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {appointment.patient?.firstName}{" "}
                  {appointment.patient?.lastName}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  ID:
                </Typography>
                <Typography variant="body1">{appointment.patientId}</Typography>
              </Paper>
            </Grid>

            {/* Doktor ma'lumotlari */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6">Doktor</Typography>
                </Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Ism Familiya:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {appointment.doctor?.firstname} {appointment.doctor?.lastname}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  ID:
                </Typography>
                <Typography variant="body1">{appointment.doctorId}</Typography>
              </Paper>
            </Grid>

            {/* Sabab */}
            {appointment.reason && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Uchrashuv Sababi
                  </Typography>
                  <Typography variant="body1">{appointment.reason}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewAppointment;
