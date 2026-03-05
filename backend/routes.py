from flask import Blueprint, request, jsonify
from extensions import db
from models import User, Deployment

# Blueprint groups all API routes under /api
api = Blueprint("api", __name__, url_prefix="/api")


# ---------------------------------------------------------------------------
# AUTH
# ---------------------------------------------------------------------------

@api.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user by email + password.
    Returns user info (id, name, role) on success.
    No JWT tokens for simplicity — the frontend stores user info in localStorage.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    email    = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful", "user": user.to_dict()}), 200


# ---------------------------------------------------------------------------
# DEPLOYMENTS
# ---------------------------------------------------------------------------

@api.route("/deployments", methods=["GET"])
def get_deployments():
    """Return all deployment requests, newest first."""
    deployments = Deployment.query.order_by(Deployment.created_at.desc()).all()
    return jsonify([d.to_dict() for d in deployments]), 200


@api.route("/deployments", methods=["POST"])
def create_deployment():
    """
    Create a new deployment request.
    Required fields: application_name, version, environment
    Optional fields: description, requested_by
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # Validate required fields
    required = ["application_name", "version", "environment"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    valid_envs = {"dev", "staging", "production"}
    if data["environment"] not in valid_envs:
        return jsonify({"error": f"environment must be one of: {', '.join(valid_envs)}"}), 400

    deployment = Deployment(
        application_name = data["application_name"].strip(),
        version          = data["version"].strip(),
        environment      = data["environment"],
        description      = data.get("description", "").strip(),
        requested_by     = data.get("requested_by", "Unknown"),
        status           = "pending",
    )
    db.session.add(deployment)
    db.session.commit()
    return jsonify({"message": "Deployment request created", "deployment": deployment.to_dict()}), 201


@api.route("/deployments/<int:deployment_id>/approve", methods=["PUT"])
def approve_deployment(deployment_id):
    """
    Approve a pending deployment.
    Requires: approved_by (name of approver) in request body.
    """
    deployment = Deployment.query.get_or_404(deployment_id)

    if deployment.status != "pending":
        return jsonify({"error": f"Cannot approve a deployment with status '{deployment.status}'"}), 400

    data        = request.get_json() or {}
    approved_by = data.get("approved_by", "Approver")

    deployment.status      = "approved"
    deployment.approved_by = approved_by
    db.session.commit()
    return jsonify({"message": "Deployment approved", "deployment": deployment.to_dict()}), 200


@api.route("/deployments/<int:deployment_id>/reject", methods=["PUT"])
def reject_deployment(deployment_id):
    """
    Reject a pending deployment.
    Requires: approved_by (name of approver) in request body.
    """
    deployment = Deployment.query.get_or_404(deployment_id)

    if deployment.status != "pending":
        return jsonify({"error": f"Cannot reject a deployment with status '{deployment.status}'"}), 400

    data        = request.get_json() or {}
    approved_by = data.get("approved_by", "Approver")

    deployment.status      = "rejected"
    deployment.approved_by = approved_by
    db.session.commit()
    return jsonify({"message": "Deployment rejected", "deployment": deployment.to_dict()}), 200


@api.route("/deployments/<int:deployment_id>", methods=["DELETE"])
def delete_deployment(deployment_id):
    """Delete a deployment record by ID."""
    deployment = Deployment.query.get_or_404(deployment_id)
    db.session.delete(deployment)
    db.session.commit()
    return jsonify({"message": "Deployment deleted"}), 200


@api.route("/deployments/<int:deployment_id>/deploy", methods=["PUT"])
def mark_deployed(deployment_id):
    """Mark an approved deployment as 'deployed'."""
    deployment = Deployment.query.get_or_404(deployment_id)

    if deployment.status != "approved":
        return jsonify({"error": "Only approved deployments can be marked as deployed"}), 400

    deployment.status = "deployed"
    db.session.commit()
    return jsonify({"message": "Marked as deployed", "deployment": deployment.to_dict()}), 200
