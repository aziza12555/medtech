import * as React from "react";
import { styled, useTheme, type Theme, type CSSObject } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";

import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { BarChart, User as UserIcon, Stethoscope, Receipt, Users, Settings, LogOut, KeyRound } from "lucide-react";
import { Link, Outlet } from "react-router-dom";


const sidebarItems = [
  { name: "Dashboard", route: "/dashboard", icon: BarChart },
  { name: "Profile", route: "/admin-profile", icon: UserIcon },
  { name: "Doctors", route: "/doctorfor-admin", icon: Stethoscope },
  { name: "Receptions", route: "/reception-panel", icon: Receipt },
  { name: "Patients", route: "/patient", icon: Users },
  { name: "Settings", route: "/settings", icon: Settings },
];


const drawerWidth = 240;
const colorPrimary = "#769382";
const colorWhite = "#fff"

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open
      ? {
          ...openedMixin(theme),
          "& .MuiDrawer-paper": openedMixin(theme),
        }
      : {
          ...closedMixin(theme),
          "& .MuiDrawer-paper": closedMixin(theme),
        }),
  }),
);

const AppBar = styled("div")<{ open?: boolean }>(({ theme, open }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 64,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  color: "#fff",
  backgroundColor: colorPrimary,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();

  // Holatlar
  const [open, setOpen] = React.useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openPasswordDialog, setOpenPasswordDialog] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const user = {  email: "admin@pc.local", role: "admin" };

  // Handlerlar
  const toggleDrawer = () => setOpen((prev) => !prev);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => setNotificationsAnchorEl(event.currentTarget);
  const handleNotificationsMenuClose = () => setNotificationsAnchorEl(null);

  const openChangePasswordDialog = () => {
    setOpenPasswordDialog(true);
    handleProfileMenuClose();
  };
  const closeChangePasswordDialog = () => setOpenPasswordDialog(false);

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill both password fields.");
      return;
    }
    alert(`Change password from ${currentPassword} to ${newPassword}`);
    setCurrentPassword("");
    setNewPassword("");
    closeChangePasswordDialog();
  };

  const handleLogout = () => {
    alert("Logout");
    handleProfileMenuClose();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Navbar */}
      <AppBar open={open}>
        <IconButton
          color="inherit"
          aria-label={open ? "close drawer" : "open drawer"}
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
          size="large"
        >
          <MenuIcon htmlColor="#fff" />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2, display: open ? "inline-flex" : "none" }}
          size="large"
        >
          <ChevronLeftIcon htmlColor="#fff" />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          MedTech
        </Typography>

   

        {/* Profil ikonka */}
        <Tooltip title="Profil sozlamalari">
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            size="large"
            sx={{ ml: 2 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#fff", color: colorPrimary }}  />
          </IconButton>
        </Tooltip>

        {/* Profil menyu */}
        <Menu
          id="profile-menu"
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { color: colorPrimary } }}
        >
          <MenuItem disabled>
            <Box>
              <Typography variant="body2">{user.email}</Typography>
              <Typography variant="body2">Role: {user.role}</Typography>
            </Box>
          </MenuItem>
          <Divider sx={{ borderColor: colorPrimary }} />
          <MenuItem onClick={openChangePasswordDialog} sx={{ display: "flex", alignItems: "center", color: colorPrimary }}>
            <KeyRound size={16} style={{ marginRight: 8 }} />
            Change Password
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ display: "flex", alignItems: "center", color: colorPrimary }}>
            <LogOut size={16} style={{ marginRight: 8 }} />
            Logout
          </MenuItem>
        </Menu>

   
      </AppBar>

      {/* Yon panel */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: "bold",
              background: colorPrimary,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              userSelect: "none",
            }}
          >
            {open ? "MedTech" : "MT"}
          </Typography>
        </DrawerHeader>

        <Divider sx={{ borderColor: colorPrimary }} />

        <List>
          {sidebarItems.map(({ name, route, icon: Icon }) => (
            <Link key={name} to={route} style={{ textDecoration: "none", color: colorWhite }}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      color: colorPrimary,
                    },
                    open ? { justifyContent: "initial" } : { justifyContent: "center" },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                        color: colorPrimary,
                      },
                      open ? { mr: 3 } : { mr: "auto" },
                    ]}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={name} sx={open ? { opacity: 1 } : { opacity: 0 }} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ mb: 2, borderColor: colorPrimary }} />
          <Link to="/" style={{ textDecoration: "none" }}>
            <ListItemButton sx={{ borderRadius: 1, color: colorPrimary }}>
              <ListItemIcon sx={{ color: colorPrimary }}>
                <LogOut />
              </ListItemIcon>
              <ListItemText primary="LogOut" />
            </ListItemButton>
          </Link>
        </Box>
      </Drawer>

      {/* Asosiy kontent */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />

        {/* Parol o'zgartirish dialogi */}
        <Dialog open={openPasswordDialog} onClose={closeChangePasswordDialog}>
          <DialogTitle sx={{ color: colorPrimary }}>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="dense"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: colorPrimary },
                "& .MuiInputBase-input": { color: colorPrimary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colorPrimary },
                  "&:hover fieldset": { borderColor: colorPrimary },
                  "&.Mui-focused fieldset": { borderColor: colorPrimary },
                },
              }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="dense"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: colorPrimary },
                "& .MuiInputBase-input": { color: colorPrimary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colorPrimary },
                  "&:hover fieldset": { borderColor: colorPrimary },
                  "&.Mui-focused fieldset": { borderColor: colorPrimary },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeChangePasswordDialog} sx={{ color: colorPrimary }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handlePasswordChange} sx={{ backgroundColor: colorPrimary }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
