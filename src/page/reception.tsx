import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  Button,
} from "@mui/material";
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Reception: React.FC = () => {
  const navigate = useNavigate();

  const receptionStats = [
    {
      title: "Yangi Bemorlar",
      value: "12",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Bugungi Uchrashuvlar",
      value: "15",
      icon: <CalendarIcon sx={{ fontSize: 40, color: "success.main" }} />,
    },
    {
      title: "Kutilayotgan Qabullar",
      value: "5",
      icon: <AddIcon sx={{ fontSize: 40, color: "warning.main" }} />,
    },
  ];

  const recentPatients = [
    {
      id: 1,
      name: "Aziza Alimova",
      phone: "+998901234567",
      time: "30 min oldin",
    },
    {
      id: 2,
      name: "Bekzod Ismoilov",
      phone: "+998901234568",
      time: "1 soat oldin",
    },
    {
      id: 3,
      name: "Dilnoza Xasanova",
      phone: "+998901234569",
      time: "2 soat oldin",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Qabulxona Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {receptionStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6">So'nggi Qo'shilgan Bemorlar</Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/reception/patients")}
              >
                Barcha Bemorlar
              </Button>
            </Box>

            <Box>
              {recentPatients.map((patient) => (
                <Box
                  key={patient.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {patient.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tel: {patient.phone}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {patient.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tezkor Amallar
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mb: 2 }}
                startIcon={<AddIcon />}
                onClick={() => navigate("/reception/patients/create")}
              >
                Yangi Bemor
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={() => navigate("/reception/appointments/create")}
              >
                Uchrashuv Belgilash
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reception;
