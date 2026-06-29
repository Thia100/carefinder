import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
      return;
    }
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="cursor-pointer">
      Log out
    </button>
  );
}