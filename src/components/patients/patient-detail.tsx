import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { api } from "../../service/api";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
};

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<Patient>(`/patients/${id}`);
        setPatient(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );

  if (!patient)
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Bemor topilmadi</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/patients")}
          sx={{ mt: 2 }}
        >
          Orqaga
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {patient.firstName} {patient.lastName}
      </Typography>
      <Typography>
        <strong>Jinsi:</strong> {patient.gender || "-"}
      </Typography>
      <Typography>
        <strong>Telefon:</strong> {patient.phone || "-"}
      </Typography>
      <Typography>
        <strong>Email:</strong> {patient.email || "-"}
      </Typography>
      <Typography>
        <strong>Izoh:</strong> {patient.notes || "-"}
      </Typography>
      <Typography>
        <strong>Yaratilgan sanasi:</strong>{" "}
        {new Date(patient.createdAt).toLocaleDateString()}
      </Typography>

      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => navigate("/patients")}
      >
        Orqaga
      </Button>
    </Box>
  );
}
