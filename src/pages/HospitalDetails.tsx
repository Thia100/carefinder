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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  if (!hospital) {
    return <p className="p-6 text-gray-500">Hospital not found.</p>;
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <Link to={"/"} className="text-sm text-blue-600 hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </Link>

        <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
            <h1 className="text-2xl font-bold">{hospital.name}</h1>
            <p>
              Average rating: ⭐ {averageRating.toFixed(1)} ({reviews.length}{" "}
              reviews)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
            <p>
              <strong>Visiting hours:</strong> {hospital.visiting_hours}
            </p>
          </div>

          <div className="pt-2 text-sm leading-relaxed text-gray-700">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {hospital.description}
            </ReactMarkdown>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <p className="text-sm font-medium">⭐: {review.rating}/5</p>
                  <p className="text-sm text-gray-700">
                    Comment: {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
            <h2 className="text-lg font-semibold">Leave a Review</h2>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
              className="w-full border rounded-md px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSubmitReview}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
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
