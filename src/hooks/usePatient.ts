// src/hooks/use-patients.ts
import { useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import {
  patientsService,
  type CreatePatientDto,
  type ListPatientsParams,
  type UpdatePatientDto,
  type Patient,
} from "../service/patients";

export const usePatients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // Patients listini olish va state'ga saqlash
  const getPatients = useCallback(
    async (params?: ListPatientsParams) => {
      setLoading(true);
      setError(null);
      try {
        const response = await patientsService.getPatients(params);
        setPatients(response.data); // State'ga saqlash
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Bemorlarni olishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const createPatient = useCallback(
    async (data: CreatePatientDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await patientsService.createPatient(data);
        // Yangi bemorni listga qo'shamiz
        setPatients((prev) => [...prev, response.data]);
        enqueueSnackbar("Bemor muvaffaqiyatli qo'shildi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Bemor qo'shishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const updatePatient = useCallback(
    async (id: string, data: UpdatePatientDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await patientsService.updatePatient(id, data);
        // Yangilangan bemorni listda yangilaymiz
        setPatients((prev) =>
          prev.map((patient) => (patient.id === id ? response.data : patient))
        );
        enqueueSnackbar("Bemor ma'lumotlari yangilandi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          "Bemor ma'lumotlarini yangilashda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const deletePatient = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await patientsService.deletePatient(id);
        // O'chirilgan bemorni listdan olib tashlaymiz
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
        enqueueSnackbar("Bemor muvaffaqiyatli o'chirildi", {
          variant: "success",
        });
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Bemorni o'chirishda xatolik";
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
    patients, // Patients listini qaytarish
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
};
