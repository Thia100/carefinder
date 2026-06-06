import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getHospital } from "../features/auth/api/getHospital";
import type { Hospital } from "../types/hospital";

import { getReviews } from "../features/auth/api/getReviews";
import type { Review } from "../types/review";

export function HospitalDetails() {
  const [hospital, setHospital] = useState<Hospital | null>(null);

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadHospital() {
      if (!id) return;

      try {
        const data = await getHospital(id);
        const reviewData = await getReviews(id);

        setReviews(reviewData);
        setHospital(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHospital();
  }, [id]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!hospital) {
    return <p>Hospital not found.</p>;
  }
  return (
    <main>
      <Link to={"/"}>Back</Link>
      <div>
        <h1>{hospital.name}</h1>

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
          <strong>Description:</strong> {hospital.description}
        </p>
      </div>
      <section>
        <h2>Reviews</h2>
        {reviews.length === 0 && (
          <p>No reviews yet.</p>
        )}
        {reviews.map((review) => (
          <article key={review.id}>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
          </article>
        )) }
      </section>
    </main>
  );
}
