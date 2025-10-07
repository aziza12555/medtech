// delete-user.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

interface DeleteUserProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteUser({
  open,
  user,
  onClose,
  onConfirm,
  loading,
}: DeleteUserProps) {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Foydalanuvchini o'chirish</DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Bu amalni ortga qaytarib bo'lmaydi!
        </Alert>

        <DialogContentText>
          Quyidagi foydalanuvchini o'chirishni istaysizmi?
        </DialogContentText>

        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {user.role}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {user.status}
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mt: 2 }}>
          Diqqat! Foydalanuvchi o'chirilgandan so'ng, uning barcha ma'lumotlari
          tizimdan butunlay o'chib ketadi.
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Bekor qilish
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "O'chirilmoqda..." : "O'chirish"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
