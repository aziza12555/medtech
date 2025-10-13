import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../service/api";

export default function CreateMedicalRecordForm() {
  const { id } = useParams<{ id: string }>(); // bemor IDsi
  const [type, setType] = useState("diagnosis");
  const [description, setDescription] = useState("");
  const [prescription, setPrescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!id) {
    return <p style={{ color: "red" }}>Bemor ID topilmadi!</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      type,
      description,
      prescription,
    };

    console.log("Yuborilayotgan ma’lumot:", payload); // <-- console.log qo‘shildi

    setLoading(true);

    try {
      await api.post(`/patients/${id}/records`, payload);

      alert("Yozuv qo‘shildi");
      setDescription("");
      setPrescription("");
    } catch (err: any) {
      console.error("Xatolik:", err);
      if (err.response?.status === 403) {
        alert("Ruxsat yo‘q: bu amalni bajarishga sizda huquq yo‘q.");
      } else {
        alert("Xatolik yuz berdi");
      }
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <h3 className="text-2xl font-semibold text-center mb-4">
        Yangi yozuv qo‘shish
      </h3>

      <label className="block">
        <span className="text-gray-700 font-medium mb-1 block">Yozuv turi</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
        >
          <option value="diagnosis">Diagnosis</option>
          <option value="treatment">Treatment</option>
          <option value="note">Note</option>
        </select>
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium mb-1 block">
          Tavsif (ixtiyoriy)
        </span>
        <textarea
          placeholder="Tavsif (ixtiyoriy)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
          rows={4}
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium mb-1 block">
          Recept (ixtiyoriy)
        </span>
        <input
          type="text"
          placeholder="Recept (ixtiyoriy)"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md text-white font-semibold ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } transition-colors duration-200`}
      >
        {loading ? "Yuklanmoqda..." : "Yozuvni saqlash"}
      </button>
    </form>
  );
}
