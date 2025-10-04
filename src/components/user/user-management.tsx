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
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/users");
      if (response.data && Array.isArray(response.data.items)) {
        const transformedUsers = response.data.items.map((user: any) => ({
          ...user,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          status: user.status === "active" ? "Faol" : "Nofaol",
        }));

        setUsers(transformedUsers);
      } else {
        throw new Error("Noma'lum formatdagi foydalanuvchilar ma'lumotlari");
      }
    } catch (err: any) {
      setError(err.message || "Foydalanuvchilarni olishda xatolik yuz berdi");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      <Typography variant="h6" gutterBottom>
        Foydalanuvchilar Boshqaruvi
        <Chip
          label={`Jami: ${users.length}`}
          color="primary"
          sx={{ ml: 2, fontWeight: "bold" }}
        />
      </Typography>

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
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            label="Role"
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            displayEmpty
          >
            <MenuItem value="">Hammasi</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="reception">Reception</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            displayEmpty
          >
            <MenuItem value="">Hammasi</MenuItem>
            <MenuItem value="active">Faol</MenuItem>
            <MenuItem value="inactive">Nofaol</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Yangilash
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            onClick={() => navigate("/user/create")}
          >
            Yangi Foydalanuvchi
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body1" align="center" sx={{ mt: 5 }}>
          {error}
        </Typography>
      ) : filteredUsers.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 5 }}>
          Foydalanuvchi topilmadi
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id.slice(0, 8)}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstname}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={roleColor(user.role)}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={statusColor(user.status)}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/user/${user.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" size="small">
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
            sx={{ mt: 2 }}
          />
        </>
      )}
    </Box>
  );
}
