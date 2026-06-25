import Papa from "papaparse";
import { useState } from "react";
import type { Hospital } from "../types/hospital";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket, faX } from "@fortawesome/free-solid-svg-icons";

type Props = {
  hospitals: Hospital[];
  search: string;
};

export function ExportCsvButton({ hospitals }: Props) {
  const [open, setOpen] = useState(false);

  const [columns, setColumns] = useState({
    name: true,
    address: true,
    phone: true,
    email: true,
    specialty: true,
    rating: true,
  });

  function toggleColumn(column: keyof typeof columns) {
    setColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  }

  function handleExport() {
    const data = hospitals.map((hospital) => {
      const row: Record<string, unknown> = {};

      if (columns.name) {
        row.Name = hospital.name;
      }

      if (columns.address) {
        row.Address = hospital.address;
      }

      if (columns.phone) {
        row.Phone = hospital.phone;
      }

      if (columns.email) {
        row.Email = hospital.email;
      }

      if (columns.specialty) {
        row.Specialty = hospital.specialty;
      }

      if (columns.rating) {
        row.Rating = hospital.rating ?? "";
      }

      return row;
    });

    const csv = Papa.unparse(data);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `hospitals-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <button
        type="button"
        title="Export Csv"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-lg"
      >
        <FontAwesomeIcon icon={faArrowUpFromBracket} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Export Hospitals</h2>

              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={columns.name}
                  onChange={() => toggleColumn("name")}
                />
                Name
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={columns.address}
                  onChange={() => toggleColumn("address")}
                />
                Address
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={columns.phone}
                  onChange={() => toggleColumn("phone")}
                />
                Phone
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={columns.email}
                  onChange={() => toggleColumn("email")}
                />
                Email
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={columns.specialty}
                  onChange={() => toggleColumn("specialty")}
                />
                Specialty
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={columns.rating}
                  onChange={() => toggleColumn("rating")}
                />
                Rating
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                handleExport();
                setOpen(false);
              }}
              className="w-full hover:bg-[#5B65DC] hover:text-white transition delay-100 cursor-pointer mt-5 rounded-2xl p-1 border border-[#5B65DC]"
            >
              Export
            </button>
          </div>
        </div>
      )}
    </>
  );
}
