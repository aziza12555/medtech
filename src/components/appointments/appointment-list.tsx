// src/components/appointments/AppointmentsList.tsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { useAppointments } from "../../hooks/use-appointments";
import { useAuth } from "../../store/auth-store";
import type { Appointment } from "../../types/appointments";

const AppointmentsList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { loading, getAppointments, updateStatus, deleteAppointment } =
    useAppointments();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState({
    doctorId: user?.role === "doctor" ? user.id : "",
    patientId: "",
    from: "",
    to: "",
    status: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Joriy rol va route ni aniqlash
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";
  const isReception = user?.role === "reception";

  // Base path ni aniqlash
  const getBasePath = () => {
    if (location.pathname.includes("/admin")) return "/admin";
    if (location.pathname.includes("/doctor")) return "/doctor";
    if (location.pathname.includes("/reception")) return "/reception";
    return "/admin";
  };

  const basePath = getBasePath();

  const fetchAppointments = async () => {
    try {
      const params = isDoctor ? { ...filters, doctorId: user.id } : filters;
      const response = await getAppointments(params);
      setAppointments(response.data.items || response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchAppointments();
  };

  const handleClearFilters = () => {
    setFilters({
      doctorId: isDoctor ? user?.id || "" : "",
      patientId: "",
      from: "",
      to: "",
      status: "",
    });
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    appointment: Appointment
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedAppointment) return;

    try {
      await updateStatus(selectedAppointment.id, newStatus);
      fetchAppointments();
      handleMenuClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      await deleteAppointment(selectedAppointment.id);
      fetchAppointments();
      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const handleEdit = () => {
    if (selectedAppointment) {
      navigate(`${basePath}/appointments/edit/${selectedAppointment.id}`);
      handleMenuClose();
    }
  };

  const handleView = () => {
    if (selectedAppointment) {
      navigate(`${basePath}/appointments/${selectedAppointment.id}`);
      handleMenuClose();
    }
  };

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

  const canCreateAppointment = isAdmin || isReception;
  const canEditAppointment = isAdmin; // Faqat admin tahrirlay oladi
  const canDeleteAppointment = isAdmin; // Faqat admin o'chira oladi

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1">
              {isDoctor ? "Mening Uchrashuvlarim" : "Uchrashuvlar"}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchAppointments}
                disabled={loading}
              >
                Yangilash
              </Button>
              {canCreateAppointment && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`${basePath}/appointments/create`)}
                >
                  Yangi Uchrashuv
                </Button>
              )}
            </Box>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filtrlar
            </Typography>
            <Grid container spacing={2}>
              {!isDoctor && (
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Doktor ID"
                    value={filters.doctorId}
                    onChange={(e) =>
                      handleFilterChange("doctorId", e.target.value)
                    }
                    size="small"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Bemor ID"
                  value={filters.patientId}
                  onChange={(e) =>
                    handleFilterChange("patientId", e.target.value)
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Dan"
                  type="date"
                  value={filters.from}
                  onChange={(e) => handleFilterChange("from", e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Gacha"
                  type="date"
                  value={filters.to}
                  onChange={(e) => handleFilterChange("to", e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <MenuItem value="">Hammasi</MenuItem>
                    <MenuItem value="scheduled">Rejalashtirilgan</MenuItem>
                    <MenuItem value="completed">Yakunlangan</MenuItem>
                    <MenuItem value="canceled">Bekor qilingan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                Qo'llash
              </Button>
              <Button variant="outlined" onClick={handleClearFilters}>
                Tozalash
              </Button>
            </Box>
          </Paper>

          {/* Appointments Table */}
          <TableContainer component={Paper}>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            )}

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bemor</TableCell>
                  <TableCell>Doktor</TableCell>
                  <TableCell>Boshlanish Vaqti</TableCell>
                  <TableCell>Tugash Vaqti</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Sabab</TableCell>
                  <TableCell align="center">Harakatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {appointment.patient?.firstName}{" "}
                          {appointment.patient?.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {appointment.patientId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {appointment.doctor?.firstname}{" "}
                          {appointment.doctor?.lastname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {appointment.doctorId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(appointment.startAt),
                        "dd.MM.yyyy HH:mm"
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(appointment.endAt), "dd.MM.yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{appointment.reason || "-"}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, appointment)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {appointments.length === 0 && !loading && (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="textSecondary">
                  Uchrashuvlar topilmadi
                </Typography>
              </Box>
            )}
          </TableContainer>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          Ko'rish
        </MenuItem>

        {canEditAppointment && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} />
            Tahrirlash
          </MenuItem>
        )}

        {/* Status o'zgartirish - Doctor va Admin uchun */}
        {(isDoctor || isAdmin) && (
          <>
            <MenuItem onClick={() => handleStatusChange("scheduled")}>
              <Chip label="S" color="primary" size="small" sx={{ mr: 1 }} />
              Rejalashtirilgan
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange("completed")}>
              <Chip label="Y" color="success" size="small" sx={{ mr: 1 }} />
              Yakunlangan
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange("canceled")}>
              <Chip label="B" color="error" size="small" sx={{ mr: 1 }} />
              Bekor qilish
            </MenuItem>
          </>
        )}

        {canDeleteAppointment && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ mr: 1 }} />
            O'chirish
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Uchrashuvni o'chirish</DialogTitle>
        <DialogContent>
          <Typography>
            Rostan ham "{selectedAppointment?.patient?.firstName}{" "}
            {selectedAppointment?.patient?.lastName}" ning uchrashuvini
            o'chirmoqchimisiz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Bekor qilish
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsList;
