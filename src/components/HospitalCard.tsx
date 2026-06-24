import type { Hospital } from "../types/hospital";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

type HospitalCardProps = {
  hospital: Hospital;
};

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <article
      className="
        bg-white
        rounded-2xl
        border border-slate-200
        p-5
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {hospital.name}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {hospital.city}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <span
          className="
            inline-block
            bg-[#89B3D8]/20
            text-[#5580AC]
            px-3 py-1
            rounded-full
            text-xs
            font-medium
          "
        >
          {hospital.specialty}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-slate-700">
          <FontAwesomeIcon icon={faPhone} className="text-[#5580AC]"/> {hospital.phone}
        </p>

        <p className="text-sm text-slate-500">
          {hospital.ownership_type}
        </p>
      </div>

      <Link
        to={`/hospital/${hospital.id}`}
        className="
          mt-5
          block
          w-full
          text-center
          bg-[#3B8780]
          text-white
          py-2.5
          rounded-xl
          font-medium
          hover:bg-[#32726c]
          transition
        "
      >
        View Details
      </Link>
    </article>
  );
}