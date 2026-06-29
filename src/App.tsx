import { Route, Routes } from "react-router-dom";
import { HospitalDetails } from "./pages/HospitalDetails";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { AdminRoute } from "./components/AdminRoute";
import { CreateHospital } from "./pages/CreateHospital";
import { EditHospital } from "./pages/EditHospital";
import { ManageHospitalReviews } from "./pages/ManageHospitalReviews";
import { EditHospitalReviews } from "./pages/EditHospitalReviews";
import { InviteAdmin } from "./pages/InviteAdmin";

import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-hospital-reviews"
          element={
            <AdminRoute>
              <ManageHospitalReviews />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/invite-admin"
          element={
            <AdminRoute>
              <InviteAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-hospital-reviews/:id"
          element={
            <AdminRoute>
              < EditHospitalReviews/>
            </AdminRoute>
          }
        />
        <Route path="/admin/edit-hospital/:id" element={<EditHospital />} />
        <Route
          path="/admin/new-hospital"
          element={
            <AdminRoute>
              <CreateHospital />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/hospital/:id" element={<HospitalDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
