import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth-store";
import { api } from "../../service/api";
import { Button } from "@mui/material";

export function LogoutButton() {
  const { logout } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    try {
      await api.post("/auth/logout");
    } catch {}
    logout();
    nav("/login", { replace: true });
  }

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={onLogout}
      fullWidth
      sx={{
        textTransform: "none",
        borderColor: "#769382",
        color: "#769382",
        "&:hover": {
          backgroundColor: "#769382",
          color: "#fff",
          borderColor: "#5c6b5a",
        },
      }}
    >
      Logout
    </Button>
  );
}
