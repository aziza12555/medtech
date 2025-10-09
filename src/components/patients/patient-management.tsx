// src/components/patients/PatientManagement.tsx - TO'G'RILANGAN
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth-store";
import type { Patient } from "../../service/patients";
import { usePatients } from "../../hooks/usePatient";

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState<string | "">("");
  const [statusFilter, setStatusFilter] = useState<string | "">("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getPatients, deletePatient } = usePatients();

  // Joriy rol va route ni aniqlash
  const isAdmin = user?.role === "admin";
  const isReception = user?.role === "reception";

  // Base path ni aniqlash
  const getBasePath = () => {
    if (location.pathname.includes("/admin")) return "/admin";
    if (location.pathname.includes("/reception")) return "/reception";
    return "/admin";
  };

  const basePath = getBasePath();
  const canCreatePatient = isAdmin || isReception;
  const canEditPatient = isAdmin;
  const canDeletePatient = isAdmin;

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Patient API so'rov boshlandi...");

      const response = await getPatients();
      console.log("✅ Patient API javobi:", response);
      console.log("📊 Response ma'lumotlari:", response);

      // Response strukturasi tekshirish
      if (!response) {
        throw new Error("API dan javob qaytmadi");
      }

      // Turli response formatlarini qo'llab-quvvatlash
      let patientsData: Patient[] = [];

      // Format 1: response = {total, offset, limit, items}
      if (response && Array.isArray(response.items)) {
        console.log("📦 Format 1: response.items = array");
        patientsData = response.items;
      }
      // Format 2: response.data = {total, offset, limit, items}
      else if (response.data && Array.isArray(response.data.items)) {
        console.log("📦 Format 2: response.data.items = array");
        patientsData = response.data.items;
      }
      // Format 3: response.data = array
      else if (Array.isArray(response.data)) {
        console.log("📦 Format 3: response.data = array");
        patientsData = response.data;
      }
      // Format 4: response = array
      else if (Array.isArray(response)) {
        console.log("📦 Format 4: response = array");
        patientsData = response;
      } else {
        console.log("❌ Noma'lum format:", response);
        throw new Error("Noma'lum formatdagi bemorlar ma'lumotlari");
      }

      console.log("🔄 Qayta ishlangan patientlar:", patientsData);
      setPatients(patientsData || []);
    } catch (err: any) {
      console.error("❌ Xatolik:", err);
      console.error("❌ Xatolik ma'lumoti:", err.response?.data);
      console.error("❌ Xatolik status:", err.response?.status);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Bemorlarni olishda xatolik yuz berdi"
      );
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleView = (patient: Patient) => {
    navigate(`${basePath}/patients/${patient.id}`);
  };

  const handleEdit = (patient: Patient) => {
    if (canEditPatient) {
      navigate(`${basePath}/patients/${patient.id}/edit`);
    }
  };

  const handleDeleteClick = (patient: Patient) => {
    if (canDeletePatient) {
      setSelectedPatient(patient);
      setDeleteDialog(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return;

    setDeleteLoading(true);
    try {
      await deletePatient(selectedPatient.id);
      setDeleteDialog(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (error: any) {
      console.error("O'chirishda xatolik:", error);
      setError(
        error.response?.data?.message || "Bemorni o'chirishda xatolik yuz berdi"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchText.toLowerCase());

    const matchesGender = genderFilter ? patient.gender === genderFilter : true;
    const matchesStatus = statusFilter ? patient.status === statusFilter : true;

    return matchesSearch && matchesGender && matchesStatus;
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const genderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "primary";
      case "female":
        return "secondary";
      default:
        return "default";
    }
  };

  const statusColor = (status: string) => {
    return status === "active" ? "success" : "warning";
  };

  const formatGender = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Erkak";
      case "female":
        return "Ayol";
      default:
        return "Noma'lum";
    }
  };

  const formatStatus = (status: string) => {
    return status === "active" ? "Faol" : "Nofaol";
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: "#769382" }}>
        {isReception ? "Bemorlar Ro'yxati" : "Bemorlar Boshqaruvi"}
        <Chip
          label={`Jami: ${patients.length}`}
          sx={{
            ml: 2,
            fontWeight: "bold",
            backgroundColor: "#769382",
            color: "white",
          }}
        />
      </Typography>

      {/* Filter qismi */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, flex: 1 }}>
          <TextField
            size="small"
            placeholder="Ism, familiya, telefon yoki email bo'yicha qidirish..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            sx={{ width: { xs: "100%", sm: "350px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#769382" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel id="gender-filter-label" sx={{ color: "#769382" }}>
              Jinsi
            </InputLabel>
            <Select
              labelId="gender-filter-label"
              value={genderFilter}
              label="Jinsi"
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#769382",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#5a7a6a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#769382",
                },
              }}
            >
              <MenuItem value="">Hammasi</MenuItem>
              <MenuItem value="male">Erkak</MenuItem>
              <MenuItem value="female">Ayol</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel id="status-filter-label" sx={{ color: "#769382" }}>
              Status
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#769382",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#5a7a6a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#769382",
                },
              }}
            >
              <MenuItem value="">Hammasi</MenuItem>
              <MenuItem value="active">Faol</MenuItem>
              <MenuItem value="inactive">Nofaol</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchPatients}
            disabled={loading}
            sx={{
              borderColor: "#769382",
              color: "#769382",
              "&:hover": {
                borderColor: "#5a7a6a",
                backgroundColor: "rgba(118, 147, 130, 0.04)",
              },
            }}
          >
            Yangilash
          </Button>

          {canCreatePatient && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`${basePath}/patients/create`)}
              sx={{
                backgroundColor: "#769382",
                "&:hover": {
                  backgroundColor: "#5a7a6a",
                },
              }}
            >
              Yangi Bemor
            </Button>
          )}
        </Box>
      </Box>

      {/* Yuklash/Error holatlari */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#769382" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : filteredPatients.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {patients.length === 0
              ? "Hali bemorlar mavjud emas"
              : "Bemor topilmadi"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {patients.length === 0
              ? "Yangi bemor qo'shish uchun 'Yangi Bemor' tugmasini bosing"
              : "Qidiruv shartlariga mos bemor mavjud emas"}
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Ism
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Familiya
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Telefon
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Jinsi
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Yaratilgan sana
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#769382" }}
                  >
                    Amallar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((patient) => (
                    <TableRow
                      key={patient.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(118, 147, 130, 0.08)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                      >
                        {patient.id?.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{patient.firstName || "-"}</TableCell>
                      <TableCell>{patient.lastName || "-"}</TableCell>
                      <TableCell>{patient.phone || "-"}</TableCell>
                      <TableCell>{patient.email || "-"}</TableCell>
                      <TableCell>
                        {patient.gender ? (
                          <Chip
                            label={formatGender(patient.gender)}
                            color={genderColor(patient.gender)}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.status ? (
                          <Chip
                            label={formatStatus(patient.status)}
                            color={statusColor(patient.status)}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.createdAt
                          ? new Date(patient.createdAt).toLocaleDateString(
                              "uz-UZ"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleView(patient)}
                          title="Ko'rish"
                          sx={{
                            color: "#769382",
                            "&:hover": {
                              backgroundColor: "rgba(118, 147, 130, 0.1)",
                            },
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {canEditPatient && (
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(patient)}
                            title="Tahrirlash"
                            sx={{
                              color: "#1976d2",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.1)",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}

                        {canDeletePatient && (
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(patient)}
                            title="O'chirish"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPatients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              mt: 2,
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: "#769382",
                },
              "& .MuiTablePagination-actions button": {
                color: "#769382",
              },
            }}
            labelRowsPerPage="Sahifadagi qatorlar:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ning ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </>
      )}

      {/* O'chirish dialogi */}
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ color: "#769382", borderBottom: "1px solid #e0e0e0" }}
        >
          Bemorni o'chirish
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bu amalni ortga qaytarib bo'lmaydi!
          </Alert>
          <Typography>Quyidagi bemorni o'chirishni istaysizmi?</Typography>
          {selectedPatient && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle1">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Telefon: {selectedPatient.phone || "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {selectedPatient.email || "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jinsi: {formatGender(selectedPatient.gender || "")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            disabled={deleteLoading}
            sx={{ color: "#769382" }}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleteLoading}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
          >
            {deleteLoading ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
