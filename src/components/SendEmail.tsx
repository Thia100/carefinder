import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Input } from "./ui/Input";
import type { Hospital } from "../types/hospital";

type Props = {
  hospitals: Hospital[];
};
export function SendEmail({ hospitals }: Props) {
  const [selectedHospitalIds, setSelectedHospitalIds] = useState<string[]>([]);

  const toggleHospital = (id: string) => {
    setSelectedHospitalIds((prev) =>
      prev.includes(id) ? prev.filter((hId) => hId !== id) : [...prev, id],
    );
  };
  const selectedHospitals = hospitals.filter((h) =>
  selectedHospitalIds.includes(h.id)
);


  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const sendEmail = async () => {
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email.trim(),
          subject: "Your Selected Hospitals",
          hospitals: selectedHospitals,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }
      toast.message("Mail sent Successfully");
      setOpen(false);
      setEmail("");
      setSelectedHospitalIds([]);
    } catch (error) {
      toast.error("Failed to send email");
    }
  };
  return (
    <>
      <button
        type="button"
        title="Share via email"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-lg text-[#122056]"
      >
        <FontAwesomeIcon icon={faEnvelope} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Share via Email</h2>

              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="cursor-pointer text-[#122056]"
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
            <Input
              label="Enter email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
              {hospitals.map((hospital) => {
                const checked = selectedHospitalIds.includes(hospital.id);

                return (
                  <div
                    key={hospital.id}
                    className="flex items-start justify-between rounded-md border p-3"
                  >
                    {/* LEFT SIDE */}
                    <div className="flex gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleHospital(hospital.id)}
                      />

                      <div>
                        <p className="font-semibold text-sm">{hospital.name}</p>
                        <p className="text-xs text-gray-500">
                          {hospital.specialty}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <button
                      type="button"
                      className="text-xs text-[#5B65DC]"
                      onClick={() => alert(hospital.name)}
                    >
                      View details
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={sendEmail} disabled={!email || selectedHospitalIds.length === 0}  className="cursor-pointer text-2xl disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
