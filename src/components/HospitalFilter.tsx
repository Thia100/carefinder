import { getHospitals } from "../features/auth/api/getHospitals";
import { useState, useEffect } from "react";
import type { Hospital } from "../types/hospital";
import { HospitalCard } from "./HospitalCard";

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
      specialty === "" || hospital.specialty?.toLowerCase() === specialty.toLowerCase();

    const matchesOwnership =
      ownershipType === "" || hospital.ownership_type?.toLowerCase() === ownershipType.toLowerCase();

    return matchesSearch && matchesSpecialty && matchesOwnership;
  });

  return (
    <div>
      <div>
        <input
          className="border-2 border-amber-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
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
        >
          <option value="">All Types</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>

      <div>
        <p>Number of hospitals: {filteredHospitals.length}</p>

        {filteredHospitals.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
}
