import {
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import api from "../../service/api";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface Doctor {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
}

interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  reason?: string;
  patient: Patient;
  doctor: Doctor;
}

interface ListResponse {
  total: number;
  offset: number;
  limit: number;
  items: Appointment[];
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [offset, setOffset] = useState(0);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<string>("");

  const [q, setQ] = useState("");

  // Backend API parametrlarini tekshirish
  const getApiParams = useCallback(() => {
    const params: any = {
      offset: offset.toString(),
      limit: limit.toString(),
    };

    // Backend qanday parametrlarni qabul qilishini tekshirish
    if (sort) params.sort = sort;
    if (doctorId) params.doctorId = doctorId;
    if (patientId) params.patientId = patientId;
    if (status) params.status = status;
    if (q) params.search = q; // backend 'q' yoki 'search' qabul qilishi mumkin

    return params;
  }, [offset, limit, sort, doctorId, patientId, status, q]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = getApiParams();
      console.log("📡 API so'rov parametrlari:", params);

      // API endpoint va metodni tekshirish
      const res = await api.get<ListResponse>("/appointments", {
        params,
        timeout: 10000, // 10 soniya timeout
      });

      console.log("✅ Serverdan ma'lumotlar qabul qilindi");
      setAppointments(res.data.items);
      setTotal(res.data.total);
    } catch (e: any) {
      console.error("❌ API xatosi:", e);

      // Xatolik turlarini aniqlash
      if (e.code === "ECONNABORTED" || e.message?.includes("timeout")) {
        setError(
          "Serverga ulanish vaqti tugadi. Iltimos, qayta urinib ko'ring."
        );
      } else if (e.response?.status === 500) {
        setError(
          "Server ichki xatosi. Iltimos, qo'llab-quvvatlash bo'limiga murojaat qiling."
        );
      } else if (e.response?.status === 400) {
        setError("Noto'g'ri so'rov formati. Parametrlarni tekshiring.");
      } else if (e.response?.status === 404) {
        setError("API manzili topilmadi. URL ni tekshiring.");
      } else if (e.response?.status === 401) {
        setError("Kirish ruxsati yo'q. Iltimos, tizimga kiring.");
      } else if (e.response?.status === 403) {
        setError("Ruxsat etilmagan. Sizda ushbu resursga kirish huquqi yo'q.");
      } else {
        setError(`Tarmoq xatosi: ${e.message || "Nomaʼlum xatolik"}`);
      }

      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [getApiParams]);

  // Dummy ma'lumotlar - server ishlamasa ham ko'rsatish uchun
  const useDummyData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const dummyAppointments: Appointment[] = [
        {
          id: "1",
          startAt: new Date(Date.now() + 86400000).toISOString(),
          endAt: new Date(Date.now() + 90000000).toISOString(),
          status: "scheduled",
          reason: "Umumiy tibbiy ko'rik",
          patient: { id: "p1", firstName: "Ali", lastName: "Valiyev" },
          doctor: {
            id: "d1",
            firstname: "Dilorom",
            lastname: "Xolmatova",
            role: "cardiologist",
          },
        },
        {
          id: "2",
          startAt: new Date(Date.now() + 172800000).toISOString(),
          endAt: new Date(Date.now() + 176400000).toISOString(),
          status: "confirmed",
          reason: "Nevrologik konsultatsiya",
          patient: { id: "p2", firstName: "Malika", lastName: "Rahimova" },
          doctor: {
            id: "d2",
            firstname: "Javohir",
            lastname: "Abdullayev",
            role: "neurologist",
          },
        },
        {
          id: "3",
          startAt: new Date(Date.now() - 86400000).toISOString(),
          endAt: new Date(Date.now() - 82800000).toISOString(),
          status: "completed",
          reason: "Davolanish jarayoni",
          patient: { id: "p3", firstName: "Sardor", lastName: "Tursunov" },
          doctor: {
            id: "d1",
            firstname: "Dilorom",
            lastname: "Xolmatova",
            role: "cardiologist",
          },
        },
      ];

      setAppointments(dummyAppointments);
      setTotal(dummyAppointments.length);
      setError(null);
      setLoading(false);
    }, 1000);
  }, []);

  // Birinchi marta yuklash - avval serverga so'rov, agar xatolik bo'lsa dummy ma'lumotlar
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchAppointments();
      } catch {
        // Agar server so'rovi muvaffaqiyatsiz bo'lsa, dummy ma'lumotlarni ko'rsatish
        useDummyData();
      }
    };

    initializeData();
  }, []);

  // Filterlar o'zgarganda
  useEffect(() => {
    setOffset(0);
    const timeoutId = setTimeout(() => {
      fetchAppointments();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [doctorId, patientId, status, sort, fetchAppointments]);

  // Qidiruv o'zgarganda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOffset(0);
      fetchAppointments();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [q, fetchAppointments]);

  // Sahifa o'zgarganda
  useEffect(() => {
    fetchAppointments();
  }, [offset, fetchAppointments]);

  const pages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Haqiqatan ham bu bandni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      alert("Band muvaffaqiyatli o'chirildi.");
      fetchAppointments();
    } catch (e: any) {
      alert("O'chirishda xatolik: " + (e.message || "Nomaʼlum xatolik"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "error";
      case "scheduled":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Tasdiqlangan";
      case "cancelled":
        return "Bekor qilingan";
      case "scheduled":
        return "Rejalashtirilgan";
      case "completed":
        return "Yakunlangan";
      default:
        return status;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  const handleRetry = () => {
    setError(null);
    fetchAppointments();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const clearAllFilters = () => {
    setSort("");
    setDoctorId("");
    setPatientId("");
    setStatus("");
    setQ("");
    setOffset(0);
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Card sx={{ maxWidth: 1200, margin: "0 auto", borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Sarlavha */}
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              mb: 4,
            }}
          >
            📋 Tibbiy Maslahatlar Ro'yxati
          </Typography>

          {/* Boshqaruv tugmalari */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={fetchAppointments}
              startIcon="🔄"
            >
              Yangilash
            </Button>

            <Button
              variant="outlined"
              onClick={useDummyData}
              startIcon="🧪"
              color="secondary"
            >
              Namuna Ma'lumotlar
            </Button>

            <Button
              variant="outlined"
              onClick={clearAllFilters}
              startIcon="🗑️"
              color="error"
            >
              Filterni Tozalash
            </Button>
          </Box>

          {/* Qidiruv va Filterlar */}
          <Box sx={{ mb: 3 }}>
            {/* Qidiruv */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <TextField
                label="Qidiruv"
                variant="outlined"
                value={q}
                onChange={handleSearchChange}
                sx={{ width: 400 }}
                placeholder="Ism, familiya, sabab bo'yicha qidirish..."
              />
            </Box>

            {/* Filterlar */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <TextField
                size="small"
                placeholder="Shifokor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                sx={{ minWidth: 150 }}
              />

              <TextField
                size="small"
                placeholder="Bemor ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                sx={{ minWidth: 150 }}
              />

              <TextField
                select
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ minWidth: 150 }}
                label="Holat"
              >
                <option value="">Barchasi</option>
                <option value="scheduled">Rejalashtirilgan</option>
                <option value="confirmed">Tasdiqlangan</option>
                <option value="cancelled">Bekor qilingan</option>
                <option value="completed">Yakunlangan</option>
              </TextField>

              <TextField
                select
                size="small"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                sx={{ minWidth: 180 }}
                label="Saralash"
              >
                <option value="">Standart</option>
                <option value="startAt:desc">Yangi boshlanishi</option>
                <option value="startAt:asc">Eski boshlanishi</option>
                <option value="createdAt:desc">Yangi yaratilgani</option>
                <option value="createdAt:asc">Eski yaratilgani</option>
              </TextField>
            </Box>
          </Box>

          {/* Yuklanish holati */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Ma'lumotlar yuklanmoqda...
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {total > 0
                    ? `${total} ta yozuvdan ${offset + 1}-${Math.min(
                        offset + limit,
                        total
                      )} oralig'i`
                    : "Serverga ulanmoqda..."}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Xatolik xabari */}
          {error && !loading && (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    Qayta urinish
                  </Button>
                }
              >
                {error}
              </Alert>

              <Button
                variant="contained"
                onClick={useDummyData}
                startIcon="🧪"
                sx={{ mt: 1 }}
              >
                Namuna Ma'lumotlarni Ko'rsatish
              </Button>
            </Box>
          )}

          {/* Asosiy kontent */}
          {!loading && !error && (
            <>
              {/* Statistika */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  px: 1,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Jami: <strong>{total}</strong> ta yozuv
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sahifa: <strong>{currentPage}</strong> / {pages}
                </Typography>
              </Box>

              {/* Bandlar ro'yxati */}
              {appointments.length === 0 ? (
                <Box sx={{ textAlign: "center", p: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📭 Hech qanday yozuv topilmadi
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Filterni o'zgartiring yoki namuna ma'lumotlarni ko'ring
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={useDummyData}
                    startIcon="🧪"
                  >
                    Namuna Ma'lumotlarni Ko'rsatish
                  </Button>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "1fr 1fr 1fr",
                      },
                      gap: 2,
                    }}
                  >
                    {appointments.map((appointment) => (
                      <Card
                        key={appointment.id}
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {appointment.reason || "Sabab ko'rsatilmagan"}
                          </Typography>

                          <Chip
                            label={getStatusText(appointment.status)}
                            color={getStatusColor(appointment.status)}
                            size="small"
                            sx={{ mb: 2 }}
                          />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            <strong>Vaqt:</strong>
                            <br />
                            {new Date(appointment.startAt).toLocaleString()} -
                            <br />
                            {new Date(appointment.endAt).toLocaleTimeString()}
                          </Typography>

                          <Typography variant="body2" paragraph>
                            <strong>Shifokor:</strong>
                            <br />
                            {appointment.doctor.firstname}{" "}
                            {appointment.doctor.lastname}
                          </Typography>

                          <Typography variant="body2" paragraph>
                            <strong>Bemor:</strong>
                            <br />
                            {appointment.patient.firstName}{" "}
                            {appointment.patient.lastName}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(appointment.id)}
                              startIcon="🗑️"
                              fullWidth
                            >
                              O'chirish
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  {/* Pagination */}
                  {pages > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        mt: 4,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => setOffset(Math.max(0, offset - limit))}
                        disabled={offset === 0}
                        startIcon="⬅️"
                      >
                        Oldingi
                      </Button>

                      <Typography variant="body1" sx={{ px: 2 }}>
                        {currentPage} / {pages}
                      </Typography>

                      <Button
                        variant="outlined"
                        onClick={() => setOffset(offset + limit)}
                        disabled={offset + limit >= total}
                        endIcon="➡️"
                      >
                        Keyingi
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Xatolik bildirishnomasi */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentsPage;
