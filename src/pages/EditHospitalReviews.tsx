import { BackButton } from "../components/ui/BackButton";
import { useParams } from "react-router-dom";
import type { Hospital } from "../types/hospital";
import { useState } from "react";
import type { Review } from "../types/review";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import { Spinner } from "../components/ui/spinner";

export function EditHospitalReviews() {
  const { id } = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function getHospital() {
    const { data: hospitalData, error } = await supabase
      .from("hospitals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setHospital(hospitalData);
  }
  async function fetchReviews() {
    const { data: reviewData, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("hospital_id", id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }

    setReviews(reviewData ?? []);
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      await Promise.all([getHospital(), fetchReviews()]);

      setLoading(false);
    }

    if (id) {
      loadData();
    }
  }, [id]);
  if (loading) {
    return <Spinner />;
  }

  if (!hospital) {
    return <p>Hospital not found.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">Manage Reviews</h1>
        <div>
          <h2>{hospital?.name}</h2>
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-xl p-4 mb-4">
              <p>
                <strong>Rating:</strong> {review.rating} ⭐
              </p>

              <p>{review.comment}</p>

              <div className="flex gap-2 mt-4">
                <button>Approve</button>

                <button>Hide</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
