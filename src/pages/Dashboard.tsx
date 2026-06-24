// import { Link } from "react-router-dom";
// import type { Hospital } from "../types/hospital";
// import { HospitalCard } from "../components/HospitalCard";

// type HospitalCardProps = {
//   hospital: Hospital;
// };
// export function Dashboard({ hospital }: HospitalCardProps) {
//   return (
//     <main className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">
//             Manage hospitals, reviews, and platform data.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Hospitals
//             </h2>

//             <p className="text-gray-600 mb-6">
//               Add new hospitals to the CareFinder directory.
//             </p>

//             <Link
//               to="/admin/new-hospital"
//               className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
//             >
//               + Create Hospital
//             </Link>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Manage Hospitals
//             </h2>

//             <p className="text-gray-600 mb-6">
//               Manage hospitals (Edit and delete hospitals)
//             </p>

//             <Link
//               to={"/"}
//               className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
//             >
//               Manage Hospital
//             </Link>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Hospitals
//             </h2>

//             <p className="text-gray-600 mb-6">
//               Add new hospitals to the CareFinder directory.
//             </p>

//             <Link
//               to={`/admin/edit-hospital/${hospital.id}`}
//               className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
//             >
//               Edit Hospital
//             </Link>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               Reviews
//             </h2>

//             <p className="text-gray-600 mb-6">
//               Monitor and manage user feedback.
//             </p>

//             <button
//               disabled
//               className="px-5 py-2 rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed"
//             >
//               Coming Soon
//             </button>
//           </div>
//         </div>

//         {/* Stats Section (optional future expansion) */}
//         <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-2xl border shadow-sm">
//             <p className="text-gray-500 text-sm">Total Hospitals</p>
//             <p className="text-2xl font-bold text-gray-900">--</p>
//           </div>

//           <div className="bg-white p-6 rounded-2xl border shadow-sm">
//             <p className="text-gray-500 text-sm">Total Reviews</p>
//             <p className="text-2xl font-bold text-gray-900">--</p>
//           </div>

//           <div className="bg-white p-6 rounded-2xl border shadow-sm">
//             <p className="text-gray-500 text-sm">Active Users</p>
//             <p className="text-2xl font-bold text-gray-900">--</p>
//           </div>
//         </div>

//         <HospitalCard hospital={hospital}/>
//       </div>
//     </main>
//   );
// }

import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Manage hospitals and platform data.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">
              Create Hospital
            </h2>

            <Link
              to={"/admin/new-hospital"}
              className="inline-block bg-[#5B65DC] text-white px-4 py-2 rounded-xl"
            >
              Add Hospital
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">
              Manage Hospitals
            </h2>

            <Link
              to={"/admin/manage-hospitals"}
              className="inline-block bg-[#122056] text-white px-4 py-2 rounded-xl"
            >
              View Hospitals
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
