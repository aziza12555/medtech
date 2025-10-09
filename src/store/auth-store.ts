import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "doctor" | "reception";

export interface User {
  id: string;
  email: string;
  role: Role;
  mustChangePassword: boolean;
  firstname: string;
  lastname: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  booted: boolean;
  changing: boolean;
  changeError: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setBooted: (value: boolean) => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      booted: false,
      changing: false,
      changeError: null,

      login: (token: string, user: User) => {
        set({ token, user, changeError: null });
      },

      logout: () => {
        set({ token: null, user: null, changeError: null });
      },

      setBooted: (value: boolean) => set({ booted: value }),

      clearError: () => set({ changeError: null }),

      async changePassword(currentPassword: string, newPassword: string) {
        set({ changing: true, changeError: null });

        try {
          // Bu yerda API chaqiruvi bo'ladi
          // const { data } = await api.post("/auth/change-password", { currentPassword, newPassword });

          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                mustChangePassword: false,
              },
            });
          }

          console.log("Password changed successfully");
        } catch (err: any) {
          let errorMessage = "Parolni almashtirishda xatolik";

          if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (Array.isArray(err?.response?.data)) {
            errorMessage = err.response.data.join(", ");
          } else if (err.message) {
            errorMessage = err.message;
          }

          set({ changeError: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ changing: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        booted: state.booted,
      }),
    }
  )
);
