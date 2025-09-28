import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-store";
import { api } from "../service/api";
import { rolePath } from "../routes/role-path";

import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Link,
  Box
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.access_token, data.user);
      nav(rolePath[data.user.role as keyof typeof rolePath], { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check your credentials.");
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card sx={{ maxWidth: 400, width: "100%", padding: 2 }}>
        <CardHeader title="Login to your account" />
        <CardContent>
          <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
                fullWidth
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Box textAlign="right">
                <Link href="#" variant="body2" underline="hover">
                  Forgot your password?
                </Link>
              </Box>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
