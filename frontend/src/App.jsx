import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login            from "./pages/Login";
import Dashboard        from "./pages/Dashboard";
import CreateDeployment from "./pages/CreateDeployment";
import Approvals        from "./pages/Approvals";

/**
 * ProtectedRoute
 * Redirects unauthenticated users to the login page.
 * Also supports role-based access: if `role` is specified, only that role
 * can access the route; others are sent to the dashboard.
 */
function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — login page */}
        <Route path="/" element={<Login />} />

        {/* Protected — any logged-in user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected — developers only */}
        <Route
          path="/create"
          element={
            <ProtectedRoute role="developer">
              <CreateDeployment />
            </ProtectedRoute>
          }
        />

        {/* Protected — approvers only */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute role="approver">
              <Approvals />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
