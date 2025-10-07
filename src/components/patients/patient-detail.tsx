import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
} from "@mui/material";
import { Edit, ArrowBack, Home, Person } from "@mui/icons-material";
import { api } from "../../service/api";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  phone?: string;
  email?: string;
  notes?: string;
  status?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
};

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔍 PatientDetail: API so'rov boshlandi, ID:", id);

        const response = await api.get(`/patients/${id}`);
        console.log("✅ PatientDetail API javobi:", response.data);

        // ✅ Backend formatini frontend formatiga o'tkazish
        const patientData: Patient = {
          id: response.data.id,
          firstName: response.data.first_name || response.data.firstName || "",
          lastName: response.data.last_name || response.data.lastName || "",
          gender: response.data.gender,
          phone: response.data.phone,
          email: response.data.email,
          notes: response.data.notes,
          status: response.data.status,
          dateOfBirth: response.data.dateOfBirth || response.data.date_of_birth,
          address: response.data.address,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        console.log("🔄 Transform qilingan patient:", patientData);
        setPatient(patientData);
      } catch (error: any) {
        console.error("❌ PatientDetail xatolik:", error);
        console.error("❌ Xatolik ma'lumoti:", error.response?.data);

        setError("Bemor ma'lumotlarini yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "primary";
      case "female":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "warning";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !patient)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress sx={{ color: "#769382" }} />
      </Box>
    );

  if (!patient)
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Bemor topilmadi</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          ID: {id}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin/patients")}
          sx={{ mt: 2 }}
        >
          Bemorlar ro'yxatiga qaytish
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/admin/dashboard")}
          sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/admin/patients")}
          sx={{ cursor: "pointer" }}
        >
          Bemorlar
        </Link>
        <Typography color="text.primary">
          {patient.firstName} {patient.lastName}
        </Typography>
      </Breadcrumbs>

      {/* Sarlavha va tugmalar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#769382" }}>
          Bemor Ma'lumotlari
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/admin/patients/${patient.id}/edit`)}
            size="small"
            sx={{
              borderColor: "#769382",
              color: "#769382",
              "&:hover": {
                borderColor: "#5a7a6a",
                backgroundColor: "rgba(118, 147, 130, 0.04)",
              },
            }}
          >
            Tahrirlash
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin/patients")}
            size="small"
          >
            Orqaga
          </Button>
        </Box>
      </Box>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
              >
                👤 Shaxsiy Ma'lumotlar
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  To'liq Ismi
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {patient.firstName} {patient.lastName}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Jinsi
                </Typography>
                {patient.gender ? (
                  <Chip
                    label={patient.gender === "male" ? "Erkak" : "Ayol"}
                    color={getGenderColor(patient.gender)}
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">-</Typography>
                )}
              </Box>

              {patient.dateOfBirth && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Tug'ilgan Sana
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(patient.dateOfBirth)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Status
                </Typography>
                {patient.status ? (
                  <Chip
                    label={patient.status === "active" ? "Faol" : "Nofaol"}
                    color={getStatusColor(patient.status)}
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">-</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
              >
                📞 Aloqa Ma'lumotlari
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Telefon
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  {patient.phone || "-"}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  {patient.email || "-"}
                </Typography>
              </Box>

              {patient.address && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Manzil
                  </Typography>
                  <Typography variant="body1">{patient.address}</Typography>
                </Box>
              )}
            </Grid>

            {patient.notes && (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
                >
                  📝 Qo'shimcha Ma'lumotlar
                </Typography>
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body1">{patient.notes}</Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
              >
                ⚙️ Tizim Ma'lumotlari
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Yaratilgan Sana
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {formatDate(patient.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                {patient.updatedAt && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Yangilangan Sana
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {formatDate(patient.updatedAt)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Bemor ID
                    </Typography>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      sx={{
                        bgcolor: "grey.100",
                        p: 1,
                        borderRadius: 1,
                        wordBreak: "break-all",
                      }}
                    >
                      {patient.id}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Xabarlar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
