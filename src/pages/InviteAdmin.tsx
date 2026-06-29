import { Input } from "../components/ui/Input";
import { useState } from "react";

export function InviteAdmin() {
  const [email, setEmail] = useState("");
  return (
    <>
      <h1>Invite as Admin</h1>
      <Input
        label="Enter email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={() => {
          console.log(email);
        }}
      >
        Invite
      </button>
    </>
  );
}
