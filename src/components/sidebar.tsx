// src/components/sidebar.tsx - TO'G'RILANGAN VERSIYA
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Drawer,
  Box,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { FaUser, FaUsers, FaStethoscope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebarStore } from "../store/sidebar.store";
import { MdEvent, MdLocalHospital } from "react-icons/md";
import { useAuth } from "../store/auth-store";

const drawerWidth = 240;

// Admin uchun menu - BARCHA HUQUQLAR
const adminMenuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/admin/dashboard" },
  { text: "Bemorlar", icon: <FaUsers />, path: "/admin/patients" },
  { text: "Uchrashuvlar", icon: <MdEvent />, path: "/admin/appointments" },
  { text: "Xodimlar", icon: <FaUser />, path: "/admin/users" },
];

// Doctor uchun menu - FAQAT O'ZI KERAKLI
const doctorMenuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/doctor/dashboard" },
  {
    text: "Mening Uchrashuvlarim",
    icon: <MdEvent />,
    path: "/doctor/appointments",
  },
  {
    text: "Mening Bemorlarim",
    icon: <FaStethoscope />,
    path: "/doctor/patients",
  },
];

// Reception uchun menu - FAQAT O'ZI KERAKLI
const receptionMenuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/reception/dashboard" },
  { text: "Bemorlar", icon: <FaUsers />, path: "/reception/patients" },
  { text: "Uchrashuvlar", icon: <MdEvent />, path: "/reception/appointments" },
];

const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Foydalanuvchi roliga qarab menu tanlash
  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return adminMenuItems;
      case "doctor":
        return doctorMenuItems;
      case "reception":
        return receptionMenuItems;
      default:
        return [];
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "doctor":
        return "Doktor";
      case "reception":
        return "Qabulxona";
      default:
        return "Foydalanuvchi";
    }
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : 0,
          boxSizing: "border-box",
          backgroundColor: "#1e293b",
          borderRight: "1px solid #334155",
          transition: "width 0.3s",
          overflowX: "hidden",
          color: "white",
        },
      }}
    >
      {/* Sidebar header */}
      <Box
        sx={{ p: 2, textAlign: "center", borderBottom: "1px solid #334155" }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: isOpen ? "1.1rem" : "0.8rem",
            transition: "font-size 0.3s",
          }}
        >
          {isOpen ? "MedTech Klinika" : "MT"}
        </Typography>
        {isOpen && (
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              display: "block",
              mt: 0.5,
            }}
          >
            {getRoleText(user?.role || "")}
          </Typography>
        )}
      </Box>

      <Toolbar />
      <Divider sx={{ borderColor: "#334155" }} />

      <List sx={{ px: 1 }}>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            key={text}
            disablePadding
            sx={{ display: "block", mb: 0.5 }}
          >
            <ListItemButton
              onClick={() => navigate(path)}
              selected={location.pathname === path}
              sx={{
                minHeight: 48,
                justifyContent: isOpen ? "initial" : "center",
                px: 2.5,
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                },
                "&:hover": {
                  backgroundColor: "#334155",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: location.pathname === path ? "white" : "#94a3b8",
                }}
              >
                {icon}
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary={text}
                  sx={{
                    color: location.pathname === path ? "white" : "#e2e8f0",
                    "& .MuiTypography-root": {
                      fontSize: "0.9rem",
                      fontWeight: location.pathname === path ? "600" : "400",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
