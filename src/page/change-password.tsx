import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-store";
import { rolePath } from "../routes/role-path";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const ChangePassword = () => {
  const { changePassword, changing, changeError, user } = useAuth();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk("");
    try {
      await changePassword(currentPassword, newPassword);
      setOk("Parol muvaffaqiyatli o'zgartirildi");
      if (user?.role) {
        navigate(rolePath[user.role as keyof typeof rolePath], {
          replace: true,
        });
      } else {
        navigate("/login", { replace: true });
      }
      setCurrent("");
      setNext("");
    } catch {}
  };

  return (
    <div className="w-full h-1/2 flex  justify-center mt-[200px]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Typography>New Password</Typography>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="max-w-sm space-y-3">
            <input
              type="password"
              placeholder="Joriy parol"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Yangi parol"
              value={newPassword}
              onChange={(e) => setNext(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <button
              type="submit"
              disabled={changing}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {changing ? "Yuborilmoqda..." : "Parolni almashtirish"}
            </button>

            {changeError && (
              <p className="text-red-600 text-sm">{changeError}</p>
            )}
            {ok && <p className="text-green-600 text-sm">{ok}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
