import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Hospital } from "../types/hospital";
import { Spinner } from "../components/ui/spinner";
import { BackHome } from "../components/ui/BackHome";
import { BackButton } from "../components/ui/BackButton";


export function ManageHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHospitals();
  }, []);

  async function getHospitals() {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
      return;
    }

    setHospitals(data || []);
    setLoading(false);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">
          Manage Hospitals
        </h1>

        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white p-5 rounded-xl border shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold">
                    {hospital.name}
                  </h2>

                  <p className="text-gray-500">
                    {hospital.city}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/admin/edit-hospital/${hospital.id}`}
                    className="bg-[#5B65DC] text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}