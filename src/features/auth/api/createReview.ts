import { supabase } from "../../../lib/supabase";

type CreateReviewInput = {
  hospitalId: string;
  rating: number;
  comment: string;
};

export async function createReview({
  hospitalId,
  rating,
  comment,
}: CreateReviewInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }
  const { error } = await supabase.from("reviews").insert({
    hospital_id: hospitalId,
    user_id: user.id,
    rating,
    comment,
  });
  if (error) {
    throw error;
  }
}
