import { getHospitals } from "../features/auth/api/getHospitals";
import { useState, useEffect } from "react";
import type { Hospital } from "../types/hospital";
import { ExportCsvButton } from "./ExportCsvButton";
import { HospitalCard } from "./HospitalCard";
import { Input } from "./ui/Input";
import { useSearchParams } from "react-router-dom";
import { ShareButton } from "./ShareButton";
import { SendEmail } from "./SendEmail";

export function HospitalFilter() {
  const [searchParams] = useSearchParams();
  const [, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [specialty, setSpecialty] = useState(
    searchParams.get("specialty") ?? "",
  );
  const [ownershipType, setOwnershipType] = useState(
    searchParams.get("ownership") ?? "",
  );

  useEffect(() => {
    async function load() {
      const data = await getHospitals();
      setHospitals(data);
    }
    load();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (specialty) params.set("specialty", specialty);
    if (ownershipType) params.set("ownership", ownershipType);

    setSearchParams(params);
  }, [search, specialty, ownershipType]);

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
    <div>
      <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm p-4 my-12">
        <div></div>
        <p className="my-2 text-slate-600 text-sm text-center">
          Search hospitals by name, city, specialty, or ownership type.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] lg:items-center gap-3">
          <Input
            placeholder="Search hospitals, city, or LGA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-[#3B8780]"
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
            className="w-full border rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-[#3B8780]"
          >
            <option value="">All Types</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">{filteredHospitals.length}</span>{" "}
          hospitals
        </p>

        <div className="flex gap-3">
          <ExportCsvButton hospitals={filteredHospitals} search={search} />
          <ShareButton
            search={search}
            specialty={specialty}
            ownershipType={ownershipType}
          />
          <SendEmail hospitals={hospitals}/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
}
