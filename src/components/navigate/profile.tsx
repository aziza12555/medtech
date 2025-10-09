// src/components/navigate/profile.tsx
import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Settings, ExitToApp, Key } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth-store";

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleMenuClose();
  };

  const handleChangePassword = () => {
    navigate("/change-password");
    handleMenuClose();
  };

  const handleSettings = () => {
    // Sozlamalar sahifasiga o'tish
    handleMenuClose();
  };

  const displayName =
    user?.firstname && user?.lastname
      ? `${user.firstname} ${user.lastname}`
      : user?.email || "Foydalanuvchi";

  const displayRole = user?.role || "Noma'lum";
  const avatarLetter = user?.firstname?.[0] || user?.email?.[0] || "U";

  const isMenuOpen = Boolean(anchorEl);

  return (
    <>
      {/* Avatar button */}
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        edge="end"
        color="inherit"
        sx={{
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
          width: 40,
          height: 40,
          transition: "all 0.2s",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#4a5e40",
            color: "#fff",
            fontWeight: "bold",
            width: 36,
            height: 36,
            fontSize: "16px",
            border: "2px solid #fff",
          }}
        >
          {avatarLetter}
        </Avatar>
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          sx: {
            py: 0,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
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
            overflow: "visible",
            mt: 1.5,
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
        {/* User info - pastga ochiladigan qism */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e9ecef",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.primary"
            noWrap
          >
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Rol: {displayRole}
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

        {/* Menu items */}
        <MenuItem
          onClick={handleSettings}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <Settings sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant="body2">Sozlamalar</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleChangePassword}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <Key sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant="body2">Parolni o'zgartirish</Typography>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            "&:hover": {
              bgcolor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant="body2">Chiqish</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Profile;
