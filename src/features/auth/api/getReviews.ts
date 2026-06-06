import { supabase } from "../../../lib/supabase";
import type { Review } from "../../../types/review";

export async function getReviews(
  hospitalId: string,
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("hospital_id", hospitalId)
    .eq("approved", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}