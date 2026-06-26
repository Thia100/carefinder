import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

type Props = {
  search: string;
  specialty: string;
  ownershipType: string;
};

export function ShareButton({ search, specialty, ownershipType }: Props) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (specialty) params.set("specialty", specialty);
  if (ownershipType) params.set("ownership", ownershipType);

  const shareUrl = `${window.location.origin}?${params.toString()}`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);

    toast.success("Link copied!");
  }
  return (
    <>
      <button onClick={copyLink} className="cursor-pointer text-[#122056]" title="Share hospitals">
        <FontAwesomeIcon icon={faShareNodes} />
      </button>
    </>
  );
}
