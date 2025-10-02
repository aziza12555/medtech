import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { api } from "../../service/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "doctor" | "reception";
  status: "Faol" | "Nofaol";
  createdAt: string;
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<User>(`/users/${id}`);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );

  if (!user)
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Foydalanuvchi topilmadi</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/user")}
          sx={{ mt: 2 }}
        >
          Orqaga
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {user.firstName} {user.lastName}
      </Typography>
      <Typography>
        <strong>Email:</strong> {user.email}
      </Typography>
      <Typography>
        <strong>Role:</strong> {user.role}
      </Typography>
      <Typography>
        <strong>Status:</strong> {user.status}
      </Typography>
      <Typography>
        <strong>Yaratilgan sanasi:</strong>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </Typography>

      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => navigate("/user")}
      >
        Orqaga
      </Button>
    </Box>
  );
}
