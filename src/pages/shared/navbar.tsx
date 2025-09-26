import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  ListItemText,
} from "@mui/material";
import { User as UserIcon, LogOut, KeyRound } from "lucide-react";
import MenuIcon from "@mui/icons-material/Menu";

interface NavbarProps {
  onDrawerToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle }) => {
  const user = { firstName: "John", lastName: "Doe", email: "john@example.com", role: "admin" };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    alert("Logout");
    handleMenuClose();
  };

  const handlePasswordChange = () => {
    alert(`Change password from ${currentPassword} to ${newPassword}`);
    setOpenDialog(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <>
      <AppBar position="fixed" >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Hamburger tugmachasi */}
          <IconButton
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            MedTech
          </Typography>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <UserIcon size={22} />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <div>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2">Role: {user.role}</Typography>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setOpenDialog(true);
                handleMenuClose();
              }}
            >
              <KeyRound size={16} style={{ marginRight: 8 }} />
              <ListItemText primary="Change Password" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogOut size={16} style={{ marginRight: 8 }} />
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
