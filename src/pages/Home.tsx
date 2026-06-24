import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { HospitalFilter } from "../components/HospitalFilter";
import { getCurrentProfile } from "../features/auth/api/getCurrentProfile";

import type { Profile } from "../types/profile";

export function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false)
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <div className="px-4 py-6 flex justify-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-center text-3xl mb-6">CareFinder</h1>

          <nav className="text-right my-4">
            {!loading && !profile && <Link to="/login">Login</Link>}

            {!loading && profile?.role === "admin" && (
              <Link to="/admin">Dashboard</Link>
            )}
          </nav>

          <HospitalFilter />
        </div>
      </div>
    </main>
  );
}
