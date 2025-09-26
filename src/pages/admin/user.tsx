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
import { useUsersStore } from "../../store/user";
import type { User } from "../../types";
import { validateEmail, validatePassword } from "../../utilits/utilt";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  role: "doctor" | "reception";
  temporaryPassword: string;
};

type FormAction =
  | { type: "update"; field: string; value: string }
  | { type: "reset"; payload: FormState };

const defaultFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  role: "doctor",
  temporaryPassword: "",
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "update":
      return { ...state, [action.field]: action.value };
    case "reset":
      return action.payload;
    default:
      return state;
  }
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role as "doctor" | "reception",
        temporaryPassword: user.temporaryPassword || "",
      },
    });
    setModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { firstName, lastName, email, temporaryPassword } = formState;

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email";
    if (!temporaryPassword.trim())
      newErrors.temporaryPassword = "Password is required";
    else if (!validatePassword(temporaryPassword))
      newErrors.temporaryPassword = "Minimum 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      await updateUser(editingUser.id, {
        ...formState,
      });
    } else {
      await addUser(formState);
    }

    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteUser(deleteId);
      setDeleteId(null);
      setConfirmOpen(false);
    }
  };

  return (
    <Box px={10}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<UserPlus />}
          onClick={openAddUser}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <CardHeader title="User List" />
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => openEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Trash2 />}
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
            <Typography align="center" py={4}>No users found</Typography>
          )}
        </CardContent>
      </Card>

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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={formState.firstName}
                  onChange={(e) => dispatch({ type: "update", field: "firstName", value: e.target.value })}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={formState.lastName}
                  onChange={(e) => dispatch({ type: "update", field: "lastName", value: e.target.value })}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  value={formState.email}
                  onChange={(e) => dispatch({ type: "update", field: "email", value: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Temporary Password"
                  type="password"
                  fullWidth
                  value={formState.temporaryPassword}
                  onChange={(e) => dispatch({ type: "update", field: "temporaryPassword", value: e.target.value })}
                  error={!!errors.temporaryPassword}
                  helperText={errors.temporaryPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Role"
                  fullWidth
                  value={formState.role}
                  onChange={(e) => dispatch({ type: "update", field: "role", value: e.target.value })}
                >
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="reception">Reception</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setModalOpen(false)} variant="outlined" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;

