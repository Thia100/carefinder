import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="border-none hover:bg-black/10 hover:p-1.5 hover:rounded-2xl  hover:border-black/20 transition-all duration-200 cursor-pointer">
     <FontAwesomeIcon icon={faArrowLeft}/>
    </button>
  );
}