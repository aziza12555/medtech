import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../../service/api";

import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Divider,
  Box,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LogoutButton } from "./logout";

const Profile = () => {
  const [user, setUser] = useState<{ email?: string; role?: string }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        edge="end"
        color="inherit"
        aria-controls={anchorEl ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
        sx={{
          bgcolor: "#769382",
          "&:hover": { bgcolor: "#5c6b5a" },
          width: 40,
          height: 40,
        }}
      >
        {user.email ? (
          <Avatar
            sx={{
              bgcolor: "#4a5e40",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {user.email.charAt(0)}
          </Avatar>
        ) : (
          <AccountCircleIcon sx={{ fontSize: 32, color: "#e0e0e0" }} />
        )}
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "profile-button",
          sx: {
            bgcolor: "#f5f9f4",
            minWidth: 220,
            borderRadius: 1,
            boxShadow: "0px 4px 10px rgba(118, 147, 130, 0.3)",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          px={2}
          py={1}
          sx={{
            backgroundColor: "#769382",
            color: "white",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        >
          <Typography variant="subtitle1" noWrap>
            {user.email || "No Email"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Role: {user.role || "Unknown"}
          </Typography>
        </Box>
        <Divider />

        <MenuItem
          component={RouterLink}
          to="/change-password"
          onClick={handleMenuClose}
          sx={{
            "&:hover": { bgcolor: "#b0c4a6", color: "#1e2d16" },
            fontWeight: "medium",
          }}
        >
          Change Password
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
          }}
          sx={{
            "&:hover": { bgcolor: "#b0c4a6", color: "#1e2d16" },
            fontWeight: "medium",
          }}
        >
          <LogoutButton />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Profile;
