import { supabase } from "../../../lib/supabase";
import type { Hospital } from "../../../types/hospital";

type HospitalFilters = {
  search?: string;
  specialty?: string;
  ownershipType?: string;
};

export async function getHospitals(
  filters?: HospitalFilters,
): Promise<Hospital[]> {
  let query = supabase
    .from("hospitals")
    .select("*");

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,
       city.ilike.%${filters.search}%,
       lga.ilike.%${filters.search}%`
    );
  }

  if (filters?.specialty) {
    query = query.eq(
      "specialty",
      filters.specialty,
    );
  }

  if (filters?.ownershipType) {
    query = query.eq(
      "ownership_type",
      filters.ownershipType,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}