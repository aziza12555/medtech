import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Jami Bemorlar",
      value: "1,234",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "#1976d2",
    },
    {
      title: "Bugungi Uchrashuvlar",
      value: "24",
      icon: <CalendarIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "#2e7d32",
    },
    {
      title: "Jami Doktorlar",
      value: "45",
      icon: <HospitalIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "#ed6c02",
    },
    {
      title: "Faol Xodimlar",
      value: "67",
      icon: <PersonIcon sx={{ fontSize: 40, color: "info.main" }} />,
      color: "#0288d1",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
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
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Umumiy Statistikalar
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
              }}
            >
              <Typography color="textSecondary">
                Barcha ma'lumotlar statistikasi
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              So'nggi Faoliyat
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Yangi foydalanuvchi qo'shildi
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    2 soat oldin
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
