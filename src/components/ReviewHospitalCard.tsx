import type { Hospital } from "../types/hospital";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

type HospitalCardProps = {
  hospital: Hospital;
};

export function ReviewHospitalCard({ hospital }: HospitalCardProps) {
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
          <h2 className="text-lg font-bold text-[#122056] capitalize">
            {hospital.name}
          </h2>

          <p className="text-sm text-[#122056] mt-1 capitalize">
            {hospital.city}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-[#122056] capitalize">
          Ownership: {""}
          {hospital.ownership_type}
        </p>
        <p className="text-sm text-[#122056]">
          <FontAwesomeIcon icon={faPhone} className="text-[#122056]" /> +234
          {hospital.phone}
        </p>
      </div>

      <div className="mt-4">
        <span
          className="
            ml-2
            inline-block
            bg-[#122056]/10
            text-[#122056]
            px-3 py-1
            rounded-lg
            text-xs
            font-medium
          "
        >
          {hospital.specialty}
        </span>
      </div>

      <Link
        to={`/admin/edit-hospital-reviews/${hospital.id}`}
        className="
          mt-5
          block
          w-full
          text-center
          bg-[#5B65DC]
          text-white
          py-2.5
          rounded-xl
          font-medium
          hover:bg-[#122056]
          transition
        "
      >
        View Reviews
      </Link>
    </article>
  );
}
