import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export function BackHome() {
    return (
        <Link to={"/"} className="bg-black/10 border border-black/30 rounded-full p-2 hover:bg-black/20 transition-all duration-200"><FontAwesomeIcon icon={faArrowLeft}/></Link>
    )

}