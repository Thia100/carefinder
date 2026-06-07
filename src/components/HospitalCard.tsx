import type { Hospital } from "../types/hospital";
import { Link } from "react-router-dom";

type HospitalCardProps = {
  hospital: Hospital;
};

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Link to={`/hospital/${hospital.id}`}>
      <article className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">{hospital.name}</h2>

        <div>
          <span className="text-blue-600 px-2 flex">{hospital.city}</span>
          <span className="text-blue-600 px-2 flex">{hospital.specialty}</span>
          <span className="text-blue-600 px-2 flex">{hospital.phone}</span>
        </div>
      </article>
    </Link>
  );
}
