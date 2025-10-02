import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Pagination,
  Stack,
} from "@mui/material";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  phone?: string;
  email?: string;
  createdAt: string;
};

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPatients = async (params: {
    offset: number;
    limit: number;
    q: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/patients", {
        params: { ...params },
      });
      setPatients(data.items);
      setTotal(data.total);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients({ offset: (page - 1) * limit, limit, q });
  }, [page, limit, q]);

  const handleSearch = () => {
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Bemorlar ro'yxati</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/patients/create")}
          sx={{ bgcolor: "#769382", "&:hover": { bgcolor: "#5a7356" } }}
        >
          Bemor qo'shish
        </Button>
      </Stack>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Qidiruv (ism, telefon, email)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Qidirish
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && (
            <Typography color="error" align="center" mt={2}>
              {error}
            </Typography>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ism</TableCell>
                <TableCell>Familiya</TableCell>
                <TableCell>Jinsi</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Yaratilgan sanasi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.length ? (
                patients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <TableCell>{patient.firstName}</TableCell>
                    <TableCell>{patient.lastName}</TableCell>
                    <TableCell>{patient.gender || "-"}</TableCell>
                    <TableCell>{patient.phone || "-"}</TableCell>
                    <TableCell>{patient.email || "-"}</TableCell>
                    <TableCell>
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Bemor topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
