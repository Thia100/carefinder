import { Link } from "react-router-dom";


export function Dashboard() {
  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>Manage hospitals and reviews.</p>
      <Link to={"/admin/new-hospital"}>Create Hospital</Link>
    </main>
  );
}