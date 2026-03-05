import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateDeployment() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "null");

  // Form fields matching the Deployment model
  const [form, setForm]     = useState({
    application_name: "",
    version:          "",
    environment:      "dev",
    description:      "",
  });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Generic change handler updates any field by name
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API}/api/deployments`, {
        ...form,
        requested_by: user?.name || "Unknown",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create deployment request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Top navigation bar */}
      <nav className="navbar">
        <span className="app-title">DeployBoard</span>
        <div className="nav-right">
          <Link to="/dashboard" className="btn btn-outline btn-sm">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container container--narrow">
        <h2 className="page-title">New Deployment Request</h2>

        <div className="card">
          <form onSubmit={handleSubmit} className="form">
            {/* Application name */}
            <div className="form-group">
              <label htmlFor="application_name">Application Name</label>
              <input
                id="application_name"
                name="application_name"
                type="text"
                placeholder="e.g. payment-service"
                value={form.application_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Version */}
            <div className="form-group">
              <label htmlFor="version">Version</label>
              <input
                id="version"
                name="version"
                type="text"
                placeholder="e.g. v1.4.2"
                value={form.version}
                onChange={handleChange}
                required
              />
            </div>

            {/* Environment dropdown */}
            <div className="form-group">
              <label htmlFor="environment">Target Environment</label>
              <select
                id="environment"
                name="environment"
                value={form.environment}
                onChange={handleChange}
              >
                <option value="dev">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            {/* Optional description */}
            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="What does this deployment include?"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="form-actions">
              <Link to="/dashboard" className="btn btn-outline">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
