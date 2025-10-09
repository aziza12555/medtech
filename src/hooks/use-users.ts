import { useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import {
  usersService,
  type CreateUserDto,
  type UpdateUserDto,
} from "../service/users";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const getUsers = useCallback(
    async (params?: { offset?: number; limit?: number }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersService.getUsers(params);
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Foydalanuvchilarni olishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const createUser = useCallback(
    async (data: CreateUserDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersService.createUser(data);
        enqueueSnackbar("Foydalanuvchi muvaffaqiyatli yaratildi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Foydalanuvchi yaratishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await usersService.updateUser(id, data);
        enqueueSnackbar("Foydalanuvchi ma'lumotlari yangilandi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          "Foydalanuvchi ma'lumotlarini yangilashda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await usersService.deleteUser(id);
        enqueueSnackbar("Foydalanuvchi muvaffaqiyatli o'chirildi", {
          variant: "success",
        });
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Foydalanuvchini o'chirishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  return {
    loading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
