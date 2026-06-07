import { getHospitals } from "../features/auth/api/getHospitals";
import { useState, useEffect } from "react";
import type { Hospital } from "../types/hospital";
import { HospitalCard } from "./HospitalCard";

import { Input } from "./ui/Input";

export function HospitalFilter() {
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [specialty, setSpecialty] = useState("");
  const [ownershipType, setOwnershipType] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getHospitals();
      setHospitals(data);
    }
    load();
  }, []);

  const query = search.trim().toLowerCase();
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      query === "" ||
      hospital.name.toLowerCase().includes(query) ||
      (hospital.city || "").toLowerCase().includes(query) ||
      (hospital.lga || "").toLowerCase().includes(query);

    const matchesSpecialty =
      specialty === "" ||
      hospital.specialty?.toLowerCase() === specialty.toLowerCase();

    const matchesOwnership =
      ownershipType === "" ||
      hospital.ownership_type?.toLowerCase() === ownershipType.toLowerCase();

    return matchesSearch && matchesSpecialty && matchesOwnership;
  });

  return (
    <div className="space-y-6 min-h-screen bg-white">
      <div className="sticky top-0 z-10 w-full bg-gray-50 p-4 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] lg:items-center gap-3">
          <Input
            placeholder="Search hospitals, city, or LGA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specialties</option>
            <option value="Maternity">Maternity</option>
            <option value="Emergency">Emergency</option>
            <option value="Dental">Dental</option>
            <option value="Pediatric">Pediatric</option>
          </select>

          <select
            value={ownershipType}
            onChange={(e) => setOwnershipType(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">{filteredHospitals.length}</span>{" "}
          hospitals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
}
