import { supabase } from "../../../lib/supabase";

export async function getAllReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      hospitals(name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}