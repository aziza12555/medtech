// AdminProfile.tsx - sidebar dagi Profile linki uchun
import React from "react";
import { Box, Typography,  Avatar, TextField, Button } from "@mui/material";
import { Card as CustomCard } from "../components/ui/Card";
const AdminProfile = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profil Ma'lumotlari
      </Typography>
      
      <CustomCard title="Shaxsiy Ma'lumotlar">
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80 }}>
              A
            </Avatar>
            <Box>
              <Typography variant="h6">Admin User</Typography>
              <Typography color="textSecondary">Administrator</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Ism" defaultValue="Admin" fullWidth />
            <TextField label="Familiya" defaultValue="User" fullWidth />
            <TextField label="Email" defaultValue="admin@medtech.uz" fullWidth />
            <TextField label="Telefon" defaultValue="+998901234567" fullWidth />
          </Box>

          <Button variant="contained" sx={{ alignSelf: "flex-start" }}>
            Saqlash
          </Button>
        </Box>
      </CustomCard>
    </Box>
  );
};

export default AdminProfile;