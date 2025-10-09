import { useState, useCallback } from "react";
import { useSnackbar } from "notistack";

import {
  appointmentsService,
  type CreateAppointmentDto,
  type ListAppointmentsParams,
  type UpdateAppointmentDto,
} from "../service/appointment";

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const getAppointments = useCallback(
    async (params?: ListAppointmentsParams) => {
      setLoading(true);
      setError(null);
      try {
        const response = await appointmentsService.getAppointments(params);
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Uchrashuvlarni olishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const createAppointment = useCallback(
    async (data: CreateAppointmentDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await appointmentsService.createAppointment(data);
        enqueueSnackbar("Uchrashuv muvaffaqiyatli yaratildi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Uchrashuv yaratishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const updateAppointment = useCallback(
    async (id: string, data: UpdateAppointmentDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await appointmentsService.updateAppointment(id, data);
        enqueueSnackbar("Uchrashuv muvaffaqiyatli yangilandi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Uchrashuvni yangilashda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await appointmentsService.updateStatus(id, status);
        enqueueSnackbar("Status muvaffaqiyatli yangilandi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Statusni yangilashda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const deleteAppointment = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await appointmentsService.deleteAppointment(id);
        enqueueSnackbar("Uchrashuv muvaffaqiyatli o'chirildi", {
          variant: "success",
        });
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Uchrashuvni o'chirishda xatolik";
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
    getAppointments,
    createAppointment,
    updateAppointment,
    updateStatus,
    deleteAppointment,
  };
};
