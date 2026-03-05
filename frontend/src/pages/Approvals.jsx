import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Approvals() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "null");

  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [actionId, setActionId]       = useState(null); // tracks which row is being processed

  useEffect(() => {
    // Only approvers should access this page
    if (!user || user.role !== "approver") {
      navigate("/dashboard");
      return;
    }
    fetchPending();
  }, []);

  // Fetch only pending deployments
  const fetchPending = async () => {
    try {
      const res = await axios.get(`${API}/api/deployments`);
      // Filter to show only requests that need a decision
      setDeployments(res.data.filter((d) => d.status === "pending"));
    } catch {
      setError("Failed to load deployments.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await axios.put(`${API}/api/deployments/${id}/approve`, {
        approved_by: user.name,
      });
      // Remove from pending list after action
      setDeployments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try {
      await axios.put(`${API}/api/deployments/${id}/reject`, {
        approved_by: user.name,
      });
      setDeployments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="page">
      {/* Navigation bar */}
      <nav className="navbar">
        <span className="app-title">DeployBoard</span>
        <div className="nav-right">
          <span className="nav-user">{user?.name} (approver)</span>
          <Link to="/dashboard" className="btn btn-outline btn-sm">
            Dashboard
          </Link>
          <button
            onClick={() => { localStorage.removeItem("user"); navigate("/"); }}
            className="btn btn-outline btn-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <h2 className="page-title">Pending Approvals</h2>

        {loading && <p className="loading-text">Loading…</p>}
        {error   && <p className="error-text">{error}</p>}

        {!loading && !error && deployments.length === 0 && (
          <div className="empty-state">
            <p>No pending deployment requests.</p>
          </div>
        )}

        {!loading && deployments.length > 0 && (
          <div className="approval-list">
            {deployments.map((d) => (
              <div key={d.id} className="approval-card">
                {/* Deployment details */}
                <div className="approval-info">
                  <h3 className="approval-app-name">{d.application_name}</h3>
                  <div className="approval-meta">
                    <span>Version: <strong>{d.version}</strong></span>
                    <span>Env: <strong className={`env-badge env-${d.environment}`}>{d.environment}</strong></span>
                    <span>By: <strong>{d.requested_by}</strong></span>
                    <span>Submitted: {d.created_at}</span>
                  </div>
                  {d.description && (
                    <p className="approval-description">{d.description}</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="approval-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(d.id)}
                    disabled={actionId === d.id}
                  >
                    {actionId === d.id ? "…" : "Approve"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(d.id)}
                    disabled={actionId === d.id}
                  >
                    {actionId === d.id ? "…" : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
