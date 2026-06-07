import { useEffect } from "react";
import { getCurrentProfile } from "../features/auth/api/getCurrentProfile";

export function TestPage() {
  useEffect(() => {
    async function load() {
      const profile = await getCurrentProfile();

      console.log(profile);
    }

    load();
  }, []);

  return <div>Testing...</div>;
}