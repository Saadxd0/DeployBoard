from datetime import datetime
from extensions import db  # shared db instance (see app.py)


class User(db.Model):
    """Represents a team member who can log in and interact with deployments."""
    __tablename__ = "users"

    id    = db.Column(db.Integer, primary_key=True)
    name  = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    # role controls permissions: 'developer' can create, 'approver' can approve/reject
    role  = db.Column(db.Enum("developer", "approver"), nullable=False, default="developer")
    # Plain-text password — fine for a demo; use hashing (bcrypt) in production
    password = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            "id":    self.id,
            "name":  self.name,
            "email": self.email,
            "role":  self.role,
        }


class Deployment(db.Model):
    """Represents a single deployment request submitted by a developer."""
    __tablename__ = "deployments"

    id               = db.Column(db.Integer, primary_key=True)
    application_name = db.Column(db.String(150), nullable=False)
    version          = db.Column(db.String(50), nullable=False)
    # Target environment for the deployment
    environment      = db.Column(db.Enum("dev", "staging", "production"), nullable=False)
    description      = db.Column(db.Text, nullable=True)
    # Lifecycle: pending → approved/rejected → deployed
    status           = db.Column(
        db.Enum("pending", "approved", "rejected", "deployed"),
        nullable=False,
        default="pending",
    )
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    # Name of the approver who took action (null until approved/rejected)
    approved_by = db.Column(db.String(100), nullable=True)
    # Who submitted this request
    requested_by = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "id":               self.id,
            "application_name": self.application_name,
            "version":          self.version,
            "environment":      self.environment,
            "description":      self.description,
            "status":           self.status,
            "created_at":       self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "approved_by":      self.approved_by,
            "requested_by":     self.requested_by,
        }
