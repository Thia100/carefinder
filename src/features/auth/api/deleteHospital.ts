import { supabase } from "../../../lib/supabase";

export async function deleteHospital(id: string) {
  const { error } = await supabase
    .from("hospitals")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}