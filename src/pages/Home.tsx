import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroLg from "../assets/images/hero-lg.webp";
import { LogoutButton } from "../components/logout";

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
    <main className="min-h-screen bg-[#FAFAFD]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="CareFinder Logo" className="h-10 w-10" />

            <div>
              <h1 className="text-xl font-bold text-[#122056]">CareFinder</h1>

              <p className="text-xs text-slate-500">
                Find trusted healthcare near you
              </p>
            </div>
          </Link>

          <ul className="flex items-center gap-4">
            {!loading && !profile && (
              <li>
                <Link
                  to="/login"
                  className="rounded-xl bg-[#5B65DC] px-5 py-2 text-white transition hover:bg-[#122056]"
                >
                  Login
                </Link>
              </li>
            )}

            {!loading && profile?.role === "admin" && (
              <li>
                <Link
                  to="/admin"
                  className="rounded-xl border border-[#122056] px-5 py-2 font-medium text-[#122056] transition hover:bg-[#122056] hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <LogoutButton />
          </ul>
        </div>
      </nav>
      <div className="max-w-6xl w-full mx-auto">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <section className="relative overflow-hidden rounded-3xl shadow-xl">
            <img
              src={heroLg}
              alt="Female doctor smiling with a stethoscope"
              className="h-120 w-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-[#122056]/90 via-[#122056]/60 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-10">
                <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur">
                  Trusted Healthcare Directory
                </span>

                <h1 className="mb-5 text-4xl font-bold leading-tight text-white md:text-6xl">
                  Find the
                  <span className="text-[#5B65DC]"> right hospital </span>
                  near you.
                </h1>

                <p className="mb-8 text-lg leading-8 text-slate-200">
                  Search hospitals by city, specialty, and ownership type to
                  quickly find quality healthcare services across Nigeria.
                </p>
              </div>
            </div>
          </section>

          <HospitalFilter />
        </div>
      </div>
    </main>
  );
}
