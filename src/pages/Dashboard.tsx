import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>

        <p className="text-gray-600 mb-8">
          Manage hospitals and platform data.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">Create Hospital</h2>

            <Link
              to={"/admin/new-hospital"}
              className="inline-block bg-[#5B65DC] text-white px-4 py-2 rounded-xl"
            >
              Add Hospital
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">Manage Hospitals</h2>

            <Link
              to={"/admin/manage-hospitals"}
              className="inline-block bg-[#122056] text-white px-4 py-2 rounded-xl"
            >
              View Hospitals
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">
              Manage Hospital Reviews
            </h2>

            <Link
              to={"/admin/manage-hospital-reviews"}
              className="inline-block bg-[#5B65DC] text-white px-4 py-2 rounded-xl"
            >
              Manage Reviews
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3">
             Invite Admin
            </h2>

            <Link
              to={"/admin/invite-admin"}
              className="inline-block bg-[#5B65DC] text-white px-4 py-2 rounded-xl"
            >
              Invite an Admin
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
