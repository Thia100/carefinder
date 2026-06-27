import { useEffect, useState } from "react";
import { ReviewHospitalCard } from "../components/ReviewHospitalCard";
import { getHospitals } from "../features/auth/api/getHospitals";
import type { Hospital } from "../types/hospital";
import { BackButton } from "../components/ui/BackButton";

export function ManageHospitalReviews() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    async function loadHospitals() {
      const data = await getHospitals();
      setHospitals(data);
    }

    loadHospitals();
  }, []);

  return (
    <main className="h-screen p-6">
      <BackButton />
      <div className="max-w-6xl mx-auto mt-5">
        <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>

        <div className="grid gap-4">
          {hospitals.map((hospital) => (
            <ReviewHospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </div>
    </main>
  );
}
