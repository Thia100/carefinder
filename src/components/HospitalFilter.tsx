// import { getHospitals } from "../features/auth/api/getHospitals";
import { useState, useEffect } from "react";
import type { Hospital } from "../types/hospital";
import { ExportCsvButton } from "./ExportCsvButton";
import { HospitalCard } from "./HospitalCard";
import { Input } from "./ui/Input";
import { useSearchParams } from "react-router-dom";
import { ShareButton } from "./ShareButton";
import { SendEmail } from "./SendEmail";
import { supabase } from "../lib/supabase";

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

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | "">("");

  useEffect(() => {
    async function load() {
      if (radius !== "" && latitude !== null && longitude !== null) {
        const { data, error } = await supabase.rpc("nearby_hospitals", {
          user_lat: latitude,
          user_lng: longitude,
          radius_km: radius,
        });

        if (error) {
          console.error(error);
          return;
        }

        setHospitals(data ?? []);
        return;
      }

      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .order("name");

      if (error) {
        console.error(error);
        return;
      }

      setHospitals(data ?? []);
    }

    load();
  }, [latitude, longitude, radius]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (specialty) params.set("specialty", specialty);
    if (ownershipType) params.set("ownership", ownershipType);
    if (radius !== "") params.set("radius", radius.toString());

    setSearchParams(params);
  }, [search, specialty, ownershipType, radius]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setRadius((prev) => (prev === "" ? 10 : prev)); // pre-populate only if untouched
      },
      (error) => {
        console.error(error);
      },
    );
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
    <div>
      <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm p-4 my-12">
        <p className="my-2 text-slate-600 text-sm text-center">
          Search hospitals by name, city, specialty, or ownership type.
        </p>

        <div className="">
          <Input
            placeholder="Search hospitals, city, or LGA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] lg:items-center gap-3">
            <Input
              type="number"
              label="Radius (km)"
              value={radius}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setRadius("");
                } else {
                  setRadius(Number(value));
                }
              }}
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
            radius={radius}
          />
          <SendEmail hospitals={hospitals} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.length === 0 ? (
          <p>No hospitals Found</p>
        ) : (
          filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))
        )}
      </div>
    </div>
  );
}
