import { Input } from "../components/ui/Input";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export function InviteAdmin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const inviteAdmin = async (email: string) => {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to invite admin");
    }

    return result;
  };

  const handleInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      await inviteAdmin(email);
      toast.success(`Invite sent to ${email}!`);
      setEmail(""); // clear the input
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Invite as Admin</h1>
      <Input
        label="Enter email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="cursor-pointer"
        onClick={handleInvite}
        disabled={loading}
      >
        {loading ? "Sending..." : "Invite"}
      </button>
    </div>
  );
}