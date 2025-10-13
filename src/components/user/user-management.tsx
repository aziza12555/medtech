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
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "doctor" | "reception";
  status: "Faol" | "Nofaol";
  createdAt: string;
};

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | "">("");
  const [statusFilter, setStatusFilter] = useState<string | "">("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 API so'rov boshlandi...");

      const response = await api.get("/users");
      console.log("✅ API javobi:", response);
      console.log("📊 Response data:", response.data);

      if (response.data && Array.isArray(response.data)) {
        console.log("📦 To'g'ri format: Array of users");
        const transformedUsers = response.data.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: user.role,
          status: user.status === "active" ? "Faol" : "Nofaol",
          createdAt: user.createdAt,
        }));

        console.log("🔄 Transform qilingan userlar:", transformedUsers);
        setUsers(transformedUsers);
      } else if (response.data && Array.isArray(response.data.items)) {
        console.log("📦 Nested format: response.data.items");
        const transformedUsers = response.data.items.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: user.role,
          status: user.status === "active" ? "Faol" : "Nofaol",
          createdAt: user.createdAt,
        }));

        console.log("🔄 Transform qilingan userlar:", transformedUsers);
        setUsers(transformedUsers);
      } else if (response.data && Array.isArray(response.data.users)) {
        console.log("📦 Nested format: response.data.users");
        const transformedUsers = response.data.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          role: user.role,
          status: user.status === "active" ? "Faol" : "Nofaol",
          createdAt: user.createdAt,
        }));

        setUsers(transformedUsers);
      } else {
        console.log("❌ Noma'lum format:", response.data);
        throw new Error("Noma'lum formatdagi foydalanuvchilar ma'lumotlari");
      }
    } catch (err: any) {
      console.error("❌ Xatolik:", err);
      console.error("❌ Xatolik ma'lumoti:", err.response?.data);
      console.error("❌ Xatolik status:", err.response?.status);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Foydalanuvchilarni olishda xatolik yuz berdi"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    navigate(`/admin/user/${user.id}`);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/users/${selectedUser.id}`);
      setDeleteDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("O'chirishda xatolik:", error);
      setError(
        error.response?.data?.message ||
          "Foydalanuvchini o'chirishda xatolik yuz berdi"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter
      ? (statusFilter === "active" && user.status === "Faol") ||
        (statusFilter === "inactive" && user.status === "Nofaol")
      : true;

    return matchesSearch && matchesRole && matchesStatus;
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

  const roleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "error";
      case "doctor":
        return "info";
      case "reception":
        return "success";
      default:
        return "default";
    }
  };

  const statusColor = (status: User["status"]) =>
    status === "Faol" ? "success" : "warning";

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: "#769382" }}>
        Foydalanuvchilar Boshqaruvi
        <Chip
          label={`Jami: ${users.length}`}
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
            placeholder="Email yoki ism bo'yicha qidirish..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            sx={{ width: { xs: "100%", sm: "300px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#769382" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel id="role-filter-label" sx={{ color: "#769382" }}>
              Role
            </InputLabel>
            <Select
              labelId="role-filter-label"
              value={roleFilter}
              label="Role"
              onChange={(e) => {
                setRoleFilter(e.target.value);
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
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="reception">Reception</MenuItem>
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
            onClick={fetchUsers}
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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/user/create")}
            sx={{
              backgroundColor: "#769382",
              "&:hover": {
                backgroundColor: "#5a7a6a",
              },
            }}
          >
            Yangi Foydalanuvchi
          </Button>
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
      ) : filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Foydalanuvchi topilmadi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Qidiruv shartlariga mos foydalanuvchi mavjud emas
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
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Ism
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Familiya
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#769382" }}>
                    Role
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
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow
                      key={user.id}
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
                        {user.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role}
                          color={roleColor(user.role)}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={statusColor(user.status)}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(user)}
                          title="Tahrirlash"
                          sx={{
                            color: "#769382",
                            "&:hover": {
                              backgroundColor: "rgba(118, 147, 130, 0.1)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                          title="O'chirish"
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(211, 47, 47, 0.1)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
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
          Foydalanuvchini o'chirish
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bu amalni ortga qaytarib bo'lmaydi!
          </Alert>
          <Typography>
            Quyidagi foydalanuvchini o'chirishni istaysizmi?
          </Typography>
          {selectedUser && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle1">
                {selectedUser.firstName} {selectedUser.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {selectedUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {selectedUser.role}
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
