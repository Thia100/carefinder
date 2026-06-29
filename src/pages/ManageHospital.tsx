import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Spinner } from "../components/ui/spinner";
import { BackHome } from "../components/ui/BackHome";
import { toast } from "sonner";
import { deleteHospital } from "../features/auth/api/deleteHospital";
import type { Hospital } from "../types/hospital";

export function ManageHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHospitals() {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .order("name");

      if (error) {
        toast.error("Failed to load hospitals");
      } else {
        setHospitals(data ?? []);
      }
      setLoading(false);
    }

    fetchHospitals();
  }, []);

  async function handleDelete(hospital: Hospital) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${hospital.name}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteHospital(hospital.id);
      setHospitals((prev) => prev.filter((h) => h.id !== hospital.id));
      toast.success(`${hospital.name} deleted`);
    } catch (error) {
      toast.error("Failed to delete hospital");
    }
  }

  if (loading) return <Spinner />;

  return (
    <main className="min-h-screen bg-[#FAFAFD] py-10 px-4">
      <div className="py-2">
        <BackHome />
      </div>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#122056] mb-2">Manage Hospitals</h1>
        <p className="text-slate-500 mb-8">Edit or delete existing hospital entries.</p>

        {hospitals.length === 0 ? (
          <p className="text-slate-400">No hospitals found.</p>
        ) : (
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl border border-[#EEEFFD] shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h2 className="text-lg font-semibold text-[#122056]">{hospital.name}</h2>
                  <p className="text-sm text-slate-500">{hospital.city} · {hospital.specialty} · {hospital.ownership_type}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/admin/edit-hospital/${hospital.id}`)}
                    className="px-4 py-2 rounded-xl bg-[#5B65DC] text-white text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hospital)}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}