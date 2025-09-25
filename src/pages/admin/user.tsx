import React, { useReducer, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  useMediaQuery,
  useTheme,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  Grid,

} from "@mui/material";

import { Edit, Trash2, UserPlus } from "lucide-react";
import { getRoleDisplayName, validateEmail, validatePassword } from "../../utilits/utilt";
import { useUsersStore } from "../../store/user";
import type { User } from "../../types";

// --- Form reducer ---
type FormState = {
  name: string;
  email: string;
  password: string;
  role: "doctor" | "reception";
};
type FormAction = { type: string; field?: string; value?: string } | { type: "reset"; payload: FormState };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "update":
      return { ...state, [action.field!]: action.value! };
    case "reset":
      return action.payload;
    default:
      return state;
  }
};

const defaultFormState: FormState = {
  name: "",
  email: "",
  password: "",
  role: "doctor",
};

const UserPage = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { users, addUser, updateUser, deleteUser } = useUsersStore();

  const [formState, dispatch] = useReducer(formReducer, defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAddUser = () => {
    setEditingUser(null);
    dispatch({ type: "reset", payload: defaultFormState });
    setModalOpen(true);
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    dispatch({
      type: "reset",
      payload: {
        name: user.name,
        email: user.email,
        password: user.password || "",
        role: user.role as "doctor" | "reception",
      },
    });
    setModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { name, email, password } = formState;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    } else if (
      users.some((u) => u.email === email && u.id !== editingUser?.id)
    ) {
      newErrors.email = "Email already exists";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Minimum 8 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      updateUser(editingUser.id, formState);
    } else {
      addUser(formState);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteUser(deleteId);
      setDeleteId(null);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Box mb={3} display="flex" justifyContent="space-between" marginLeft={"80px"} alignItems="center" >
        <Typography variant="h4" component="h1" fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UserPlus size={20} />}
          onClick={openAddUser}
        >
          Add User
        </Button>
      </Box>

      <Card >
        <CardHeader title="User List" />
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>••••••••</TableCell>
                    <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<Edit size={16} />}
                          onClick={() => openEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Trash2 size={16} />}
                          onClick={() => {
                            setDeleteId(user.id);
                            setConfirmOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography textAlign="center" color="text.secondary" py={4}>
              No users found
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formState.name}
                  onChange={(e) =>
                    dispatch({ type: "update", field: "name", value: e.target.value })
                  }
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={formState.email}
                  onChange={(e) =>
                    dispatch({ type: "update", field: "email", value: e.target.value })
                  }
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={(e) =>
                    dispatch({ type: "update", field: "password", value: e.target.value })
                  }
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Role"
                  name="role"
                  value={formState.role}
                  onChange={(e) =>
                    dispatch({ type: "update", field: "role", value: e.target.value })
                  }
                  fullWidth
                >
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="reception">Reception</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setModalOpen(false)} color="error" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullScreen={fullScreen}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserPage;
