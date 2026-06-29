import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Input } from "./ui/Input";


type Props = {
  search: string;
  specialty: string;
  ownershipType: string;
};
export function SendEmail({ search, specialty, ownershipType }: Props) {
  const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (specialty) params.set("specialty", specialty);
  if (ownershipType) params.set("ownership", ownershipType);
  const shareUrl = `${window.location.origin}?${params.toString()}`;

  const sendEmail = async () => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Hospital List",
          message: shareUrl,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }
      await response.json();

      toast.message("Mail sent Successfully");
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
            <Input label="Enter email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <button onClick={sendEmail} className="cursor-pointer text-2xl">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
