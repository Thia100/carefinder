import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getHospital } from "../features/auth/api/getHospital";
import type { Hospital } from "../types/hospital";

import { getReviews } from "../features/auth/api/getReviews";
import { createReview } from "../features/auth/api/createReview";
import type { Review } from "../types/review";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

import { Spinner } from "../components/ui/spinner";

import { BackHome } from "../components/ui/BackHome";

export function HospitalDetails() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadHospital() {
      if (!id) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        const data = await getHospital(id);
        const reviewData = await getReviews(id);

        setHospital(data);
        setReviews(reviewData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHospital();
  }, [id]);

  async function handleSubmitReview() {
    if (!id) return;

    try {
      await createReview({
        hospitalId: id,
        rating,
        comment,
      });

      const updatedReviews = await getReviews(id);

      setReviews(updatedReviews);

      setRating(5);
      setComment("");

      console.log("Review submitted");
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  if (!hospital) {
    return <p className="p-6 text-gray-500">Hospital not found.</p>;
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  return (
    <main className="min-h-screen bg-[#FAFAFD] p-8">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div>
          <BackHome />
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#EEEFFD] shadow-sm">
          <div>
            <img
              src={hospital.image_url ?? ""}
              alt={hospital.name}
              className="h-95 w-full rounded-3xl object-cover border border-[#EEEFFD]"
            />
          </div>

          <h1 className="text-3xl font-bold text-[#122056] capitalize mt-10 mb-5">
            {hospital.name}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="px-3 py-1 rounded-lg bg-[#EEEFFD] text-[#5B65DC] text-sm font-medium">
              Average Rating: ⭐ {averageRating.toFixed(1)}
            </span>
            <span className="text-slate-500 text-sm">
              {reviews.length} reviews
            </span>
          </div>

          <div className=" grid md:grid-cols-2 text-sm w-full gap-10">
            <div className="flex flex-col gap-2 mt-8">
              <p>
                <strong>Address:</strong> {hospital.address}
              </p>
              <p>
                <strong>City:</strong> {hospital.city}
              </p>
              <p>
                <strong>LGA:</strong> {hospital.lga}
              </p>
              <p>
                <strong>Phone:</strong> {hospital.phone}
              </p>
              <p>
                <strong>Email:</strong> {hospital.email}
              </p>
              <p>
                <strong>Specialty:</strong> {hospital.specialty}
              </p>
              <p>
                <strong>Ownership:</strong> {hospital.ownership_type}
              </p>
            </div>

            <div>
              <div className="bg-white rounded-3xl py-2 px-4 border border-[#EEEFFD]">
                <h2 className="text-lg font-semibold text-[#122056] mb-3">
                  About this Hospital
                </h2>
                <div className="prose prose-slate">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                    {hospital.description}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFD] mt-4">
                <h2 className="text-lg font-semibold text-[#122056]">Notes</h2>
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                    {hospital.notes}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-[#EEEFFD] mt-4">
                <h2 className="text-lg font-semibold text-[#122056]">
                  Visiting Hours
                </h2>
                <div>
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                    {hospital.visiting_hours}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#EEEFFD] space-y-4">
          <h2 className="text-lg font-semibold text-[#122056]">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-[#EEEFFD] p-4 bg-[#FAFAFD]"
                >
                  <p className="font-semibold text-[#122056]">
                    ⭐: {review.rating}/5
                  </p>
                  <p className="mt-2 text-slate-600">
                    Comment: {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="bg-white rounded-3xl p-8 border border-[#EEEFFD] shadow-sm space-y-3">
            <h2 className="text-xl font-semibold text-[#122056]">
              Leave a Review
            </h2>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-[#5B65DC] focus:ring-2 focus:ring-[#EEEFFD] focus:outline-none"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 h-32 resize-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#EEEFFD] focus:outline-none"
            />

            <button
              onClick={handleSubmitReview}
              className="bg-[#122056] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#5B65DC] transition-colors"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            <Link to={"/login"} className="text-blue-600 hover:underline">
              Login
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>
    </main>
  );
}
