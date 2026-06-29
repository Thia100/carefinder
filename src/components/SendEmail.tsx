import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

type Props = {
  search: string;
  specialty: string;
  ownershipType: string;
};
export function SendEmail({ search, specialty, ownershipType }: Props) {

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
          to: "thegbolahanfathia@gmail.com",
          subject: "Hospital Added",
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
    <button onClick={sendEmail}>
      <FontAwesomeIcon icon={faEnvelope} />
    </button>
  );
}
