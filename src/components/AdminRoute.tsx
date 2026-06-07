import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getCurrentProfile } from "../features/auth/api/getCurrentProfile";
import type { Profile } from "../types/profile";
import { Spinner } from "./ui/spinner";

type AdminRouteProps = {
  children: React.ReactNode;
};

export function AdminRoute({
  children,
}: AdminRouteProps) {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getCurrentProfile();

        setProfile(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}