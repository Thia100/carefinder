import type { Hospital } from "../types/hospital";
import { Link } from "react-router-dom";

type HospitalCardProps = {
  hospital: Hospital;
};

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Link to={`/hospital/${hospital.id}`}>
      <article className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold">{hospital.name}</h2>

        <p>{hospital.city}</p>

        <p>{hospital.specialty}</p>

        <p>{hospital.phone}</p>
      </article>
    </Link>
  );
}
