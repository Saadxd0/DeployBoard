import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import DeploymentTable from "../components/DeploymentTable";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();

  // Read logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  // Fetch all deployments when the page loads
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      const res = await axios.get(`${API}/api/deployments`);
      setDeployments(res.data);
    } catch {
      setError("Failed to load deployments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deployment request?")) return;
    try {
      await axios.delete(`${API}/api/deployments/${id}`);
      // Remove from local state without re-fetching
      setDeployments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert("Failed to delete deployment.");
    }
  };

  const handleMarkDeployed = async (id) => {
    try {
      const res = await axios.put(`${API}/api/deployments/${id}/deploy`);
      setDeployments((prev) =>
        prev.map((d) => (d.id === id ? res.data.deployment : d))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to mark as deployed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Summary counts for the stat cards
  const counts = {
    total:    deployments.length,
    pending:  deployments.filter((d) => d.status === "pending").length,
    approved: deployments.filter((d) => d.status === "approved").length,
    deployed: deployments.filter((d) => d.status === "deployed").length,
  };

  return (
    <div className="page">
      {/* Top navigation bar */}
      <nav className="navbar">
        <span className="app-title">DeployBoard</span>
        <div className="nav-right">
          <span className="nav-user">
            {user?.name} ({user?.role})
          </span>
          {user?.role === "developer" && (
            <Link to="/create" className="btn btn-primary btn-sm">
              + New Request
            </Link>
          )}
          {user?.role === "approver" && (
            <Link to="/approvals" className="btn btn-secondary btn-sm">
              Approvals
            </Link>
          )}
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <h2 className="page-title">Dashboard</h2>

        {/* Summary stat cards */}
        <div className="stats-grid">
          <StatCard label="Total"    value={counts.total}    color="blue" />
          <StatCard label="Pending"  value={counts.pending}  color="yellow" />
          <StatCard label="Approved" value={counts.approved} color="green" />
          <StatCard label="Deployed" value={counts.deployed} color="purple" />
        </div>

        {/* Deployment table */}
        {loading && <p className="loading-text">Loading deployments…</p>}
        {error   && <p className="error-text">{error}</p>}
        {!loading && !error && (
          <DeploymentTable
            deployments={deployments}
            user={user}
            onDelete={handleDelete}
            onMarkDeployed={handleMarkDeployed}
          />
        )}
      </div>
    </div>
  );
}

// Small reusable stat card component
function StatCard({ label, value, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
