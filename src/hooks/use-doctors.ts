import { useState, useCallback, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  doctorsService,
  type Doctor,
  type CreateDoctorDto,
  type UpdateDoctorDto,
  type ListDoctorsParams,
} from "../service/doctors";

export const useDoctors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // Doctorlarni olish
  const getDoctors = useCallback(
    async (params?: ListDoctorsParams) => {
      setLoading(true);
      setError(null);
      try {
        const response = await doctorsService.getDoctors(params);
        setDoctors(response.data);
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Doctorlarni olishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  // Yangi doctor yaratish
  const createDoctor = useCallback(
    async (data: CreateDoctorDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await doctorsService.createDoctor(data);
        setDoctors((prev) => [...prev, response.data]);
        enqueueSnackbar("Doctor muvaffaqiyatli qo'shildi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Doctor qo'shishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  // Doctor yangilash
  const updateDoctor = useCallback(
    async (id: string, data: UpdateDoctorDto) => {
      setLoading(true);
      setError(null);
      try {
        const response = await doctorsService.updateDoctor(id, data);
        setDoctors((prev) =>
          prev.map((doctor) => (doctor.id === id ? response.data : doctor))
        );
        enqueueSnackbar("Doctor ma'lumotlari yangilandi", {
          variant: "success",
        });
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Doctor yangilashda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  // Doctor o'chirish
  const deleteDoctor = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await doctorsService.deleteDoctor(id);
        setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
        enqueueSnackbar("Doctor muvaffaqiyatli o'chirildi", {
          variant: "success",
        });
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Doctor o'chirishda xatolik";
        setError(message);
        enqueueSnackbar(message, { variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  // Avtomatik doctorlarni yuklash
  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  return {
    loading,
    error,
    doctors,
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
};
