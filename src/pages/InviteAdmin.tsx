import { Input } from "../components/ui/Input";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export function InviteAdmin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const inviteAdmin = async (email: string) => {
     await supabase.auth.refreshSession();
    const { data, error } = await supabase.functions.invoke("invite-admin", {
      body: { email },
    });

    if (error) {
      throw new Error(error.message || "Failed to invite admin");
    }

    return data;
  };

  const handleInvite = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("SESSION:", session);
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      await inviteAdmin(email);
      toast.success(`Invite sent to ${email}!`);
      setEmail("");
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
