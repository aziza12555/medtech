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
  Table,
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

  const columns = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    {
      key: "role",
      label: "Role",
      render: (value: string) => getRoleDisplayName(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row: User) => (
        <div className="flex gap-1 justify-end">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => openEditUser(row)}
            startIcon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              setDeleteId(row.id);
              setConfirmOpen(true);
            }}
            startIcon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UserPlus size={20} />}
          onClick={openAddUser}
        >
          Add User
        </Button>
      </div>

      <Card title="User List">
        {users.length > 0 ? (
          <Table data={users} columns={columns} />
        ) : (
          <p className="text-center text-gray-500 py-4">No users found</p>
        )}
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
          <DialogContent className="space-y-4">
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
    </>
  );
};

export default UserPage;
