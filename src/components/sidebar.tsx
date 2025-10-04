import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { FaUser, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../store/sidebar.store";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
  { text: "Patients", icon: <FaUsers />, path: "/patients" },
  { text: "Users", icon: <FaUser />, path: "/user" },
];

const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: isOpen ? drawerWidth : 0,
        height: "100vh",
        overflowX: "hidden",
        transition: "width 0.3s",
        bgcolor: "#f5f5f5",
        borderRight: "1px solid #ddd",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 1200,
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => navigate(`/admin${path}`)}
              sx={{
                minHeight: 48,
                justifyContent: isOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: "#769382",
                }}
              >
                {icon}
              </ListItemIcon>
              {isOpen && <ListItemText primary={text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
