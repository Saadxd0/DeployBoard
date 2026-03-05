/**
 * DeploymentTable
 * Renders a table of deployment requests.
 * Receives data and callbacks as props — no direct API calls here.
 */
export default function DeploymentTable({ deployments, user, onDelete, onMarkDeployed }) {
  if (deployments.length === 0) {
    return (
      <div className="empty-state">
        <p>No deployment requests yet.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Application</th>
            <th>Version</th>
            <th>Environment</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Approved By</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.application_name}</td>
              <td><code>{d.version}</code></td>

              {/* Environment badge */}
              <td>
                <span className={`env-badge env-${d.environment}`}>
                  {d.environment}
                </span>
              </td>

              <td>{d.requested_by || "—"}</td>

              {/* Status badge — colour changes with status */}
              <td>
                <span className={`status-badge status-${d.status}`}>
                  {d.status}
                </span>
              </td>

              <td>{d.approved_by || "—"}</td>
              <td>{d.created_at}</td>

              {/* Actions column — buttons differ by role and current status */}
              <td className="actions-cell">
                {/* Mark as deployed — visible to approvers when status is approved */}
                {user?.role === "approver" && d.status === "approved" && (
                  <button
                    className="btn btn-success btn-xs"
                    onClick={() => onMarkDeployed(d.id)}
                  >
                    Mark Deployed
                  </button>
                )}

                {/* Delete — any role can delete */}
                <button
                  className="btn btn-danger btn-xs"
                  onClick={() => onDelete(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
