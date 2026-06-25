import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroSmall from "../assets/images/hero-small.webp";
import heroLg from "../assets/images/hero-lg.webp";

import { HospitalFilter } from "../components/HospitalFilter";
import { getCurrentProfile } from "../features/auth/api/getCurrentProfile";

import type { Profile } from "../types/profile";

export function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <div className="px-4 py-6 flex justify-center">

        <div className="w-full max-w-5xl">
          <nav className="text-right my-4 bg-[#4A8BBE] p-2">
            <div>
              
            </div>
            <ul>
              <li></li>
            </ul>
            {!loading && !profile && <Link to="/login">Login</Link>}

            {!loading && profile?.role === "admin" && (
              <Link to="/admin">Dashboard</Link>
            )}
          </nav>

          <div className="relative w-full">
            <img
              src={heroLg}
              alt="image showing a female doctor standing and waering a stetoscope on her next"
              className="mx-auto w-full rounded-2xl object-cover h-100"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center rounded-2xl px-4 bg-black/30">
              <h1 className="text-2xl md:text-5xl font-semibold text-white my-2">
                Welcome to <span className="text-[#4A8BBE]">CareFinder</span>
              </h1>
              <p className="text-white text-sm md:text-base">Where you can find hospitals near you</p>
            </div>
          </div>

          <HospitalFilter />
        </div>
      </div>
    </main>
  );
}
