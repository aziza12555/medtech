// src/components/navbar.tsx
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToggleButton } from "./sidebartoggler";
import { AccountCircle, Settings, ExitToApp, Key } from "@mui/icons-material";
import { useAuth } from "../store/auth-store";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleChangePassword = () => {
    navigate("/change-password");
    handleClose();
  };

  const handleProfile = () => {
    // Profile sahifasiga o'tish (keyinroq qo'shasiz)
    handleClose();
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

  const getAvatarLetter = () => {
    return user?.firstname?.[0] || user?.email?.[0] || "U";
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      sx={{
        width: "100%",
        bgcolor: "#769382",
        color: "#fff",
        position: "static",
      }}
    >
      <Toolbar>
        <ToggleButton />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          MedTech Klinika
        </Typography>

        {/* User info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {user?.firstname} {user?.lastname} - {getRoleText(user?.role || "")}
          </Typography>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#4a5e40",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "14px",
                border: "2px solid #fff",
              }}
            >
              {getAvatarLetter()}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            {/* User info section */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {user?.firstname} {user?.lastname}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Rol: {getRoleText(user?.role || "")}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.5,
                  opacity: 0.8,
                }}
              >
                {user?.email}
              </Typography>
            </Box>

            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
              Profil
            </MenuItem>

            <MenuItem onClick={handleChangePassword}>
              <Key sx={{ mr: 2, fontSize: 20 }} />
              Parolni o'zgartirish
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <Settings sx={{ mr: 2, fontSize: 20 }} />
              Sozlamalar
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.light",
                  color: "error.contrastText",
                },
              }}
            >
              <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
              Chiqish
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
