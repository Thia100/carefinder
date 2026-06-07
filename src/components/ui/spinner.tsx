import { ClipLoader } from "react-spinners";

export function Spinner() {
  return (
    <div className="h-screen flex items-center justify-center">
        <ClipLoader />
    </div>
  );
}
