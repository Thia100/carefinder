import { HospitalFilter } from "../components/HospitalFilter";
import { useEffect } from "react";

export function Home() {

  
  return (
    <main className="bg-white min-h-screen">
      <div className="px-4 py-6 flex justify-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-center text-3xl mb-6">CareFinder</h1>
          <HospitalFilter />
        </div>
      </div>
    </main>
  );
}
