-- ============================================================
-- DeployBoard — Database Initialization Script
-- Runs automatically when the MySQL container starts for
-- the first time (mounted as /docker-entrypoint-initdb.d/).
-- ============================================================

-- Use the database created by MYSQL_DATABASE env var
USE deployboard;

-- ------------------------------------------------------------
-- Table: users
-- Stores team members who can log in.
-- Roles:
--   developer  → can create deployment requests
--   approver   → can approve / reject requests
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id         INT           NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    role       ENUM('developer', 'approver') NOT NULL DEFAULT 'developer',
    -- Plain-text passwords for demo purposes only.
    -- Use bcrypt / Argon2 hashing in a real application.
    password   VARCHAR(200)  NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ------------------------------------------------------------
-- Table: deployments
-- Stores every deployment request and its current lifecycle state.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deployments (
    id               INT          NOT NULL AUTO_INCREMENT,
    application_name VARCHAR(150) NOT NULL,
    version          VARCHAR(50)  NOT NULL,
    -- Target environment for this release
    environment      ENUM('dev', 'staging', 'production') NOT NULL,
    description      TEXT,
    -- Lifecycle: pending → approved/rejected → deployed
    status           ENUM('pending', 'approved', 'rejected', 'deployed') NOT NULL DEFAULT 'pending',
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Set when an approver acts on the request
    approved_by      VARCHAR(100),
    -- Name of the developer who submitted the request
    requested_by     VARCHAR(100),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ------------------------------------------------------------
-- Seed data — demo accounts
-- ------------------------------------------------------------

-- Developer account: can create deployment requests
INSERT INTO users (name, email, role, password) VALUES
    ('Alice Developer', 'dev@demo.com', 'developer', 'dev123');

-- Approver account: can approve or reject requests
INSERT INTO users (name, email, role, password) VALUES
    ('Bob Approver', 'approver@demo.com', 'approver', 'approver123');


-- ------------------------------------------------------------
-- Seed data — sample deployments (so the dashboard isn't empty)
-- ------------------------------------------------------------

INSERT INTO deployments (application_name, version, environment, description, status, requested_by) VALUES
    ('payment-service',  'v2.1.0', 'staging',    'Add Stripe v3 integration',         'pending',  'Alice Developer'),
    ('auth-service',     'v1.5.2', 'production', 'Security patch for JWT expiry bug',  'approved', 'Alice Developer'),
    ('frontend-app',     'v3.0.0', 'dev',        'New dashboard UI rollout',           'deployed', 'Alice Developer'),
    ('notification-svc', 'v1.0.1', 'staging',    'Fix email template rendering issue', 'rejected', 'Alice Developer');

-- Update approved_by for the rows that have been actioned
UPDATE deployments SET approved_by = 'Bob Approver' WHERE status IN ('approved', 'rejected', 'deployed');
