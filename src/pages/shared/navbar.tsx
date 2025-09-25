import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  ListItemText,
  Typography,
} from "@mui/material";
import { User as UserIcon, LogOut, KeyRound } from "lucide-react";
import { useAuthStore } from "../../store/auth-store";

export const Navbar: React.FC = () => {
  const { user, logout, changePassword } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword(currentPassword, newPassword);
      alert("Password changed successfully!");
      setOpenDialog(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Failed to change password");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 pl-88 ">
      <div className="mx-auto px-5 sm:px-6 lg:px-9">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">MedTech</h1>

          {user && (
            <>
              {/* Faqat user icon */}
              <IconButton onClick={handleMenuOpen}>
                <UserIcon size={22} />
              </IconButton>

              {/* Drop-down */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { minWidth: 220 } }}
              >
              
                <MenuItem disabled>
                  <div className="flex flex-col">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user.firstName ?? " "} {user.lastName ?? ""}
                    </Typography>
                    <Typography variant="h6" sx={{color:"black"}}>
                      {user.email}
                    </Typography>
                    <Typography variant="h6" >
                      Role: {user.role}
                    </Typography>
                  </div>
                </MenuItem>

                <Divider />

             
                <MenuItem
                  onClick={() => {
                    setOpenDialog(true);
                    handleMenuClose();
                  }}
                >
                  <KeyRound size={16} className="mr-2" />
                  <ListItemText primary="Change Password" />
                </MenuItem>

                {/* Logout */}
                <MenuItem onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>

      {/* Change password dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};
