import { supabase } from "../../../lib/supabase";

export async function updateReviewStatus(
  reviewId: string,
  approved: boolean
) {
  const { error } = await supabase
    .from("reviews")
    .update({ approved })
    .eq("id", reviewId);

  if (error) throw error;
}