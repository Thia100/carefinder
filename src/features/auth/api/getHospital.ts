import { supabase } from "../../../lib/supabase";
import type { Hospital } from "../../../types/hospital";

export async function getHospital(id: string): Promise<Hospital> {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
