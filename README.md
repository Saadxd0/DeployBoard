# DeployBoard — Deployment Request & Approval System

A professional 3-tier web application that simulates a **deployment approval workflow** used by DevOps teams.

---

## Architecture

```
Browser (React)  →  Flask REST API  →  MySQL Database
   :3000               :5000               :3306
```

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, Vite, Axios   |
| Backend   | Python, Flask, SQLAlchemy |
| Database  | MySQL 8.0               |

---

## Quick Start (Docker — recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run the app

```bash
git clone <repo-url>
cd DeployBoard

docker compose up --build
```

Wait ~30 seconds for MySQL to initialise, then open:

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:5000/api |
| MySQL    | localhost:3306            |

### Stop the app

```bash
docker compose down
```

To also delete the database volume:

```bash
docker compose down -v
```

---

## Demo Accounts

| Role      | Email                | Password     |
|-----------|----------------------|--------------|
| Developer | dev@demo.com         | dev123       |
| Approver  | approver@demo.com    | approver123  |

**Developer** can:
- Submit new deployment requests
- View all deployments on the dashboard
- Delete deployment records

**Approver** can:
- View all deployments on the dashboard
- Approve or reject pending requests (Approvals page)
- Mark approved deployments as "Deployed"
- Delete deployment records

---

## Deployment Lifecycle

```
[Submitted]  →  pending
[Approved]   →  approved  →  deployed
[Rejected]   →  rejected
```

---

## API Endpoints

### Authentication
| Method | Endpoint     | Description        |
|--------|--------------|--------------------|
| POST   | /api/login   | Login with email + password |

### Deployments
| Method | Endpoint                            | Description                  |
|--------|-------------------------------------|------------------------------|
| GET    | /api/deployments                    | List all deployments         |
| POST   | /api/deployments                    | Create a deployment request  |
| PUT    | /api/deployments/:id/approve        | Approve a pending deployment |
| PUT    | /api/deployments/:id/reject         | Reject a pending deployment  |
| PUT    | /api/deployments/:id/deploy         | Mark an approved deployment as deployed |
| DELETE | /api/deployments/:id                | Delete a deployment record   |

#### POST /api/deployments — Request body
```json
{
  "application_name": "payment-service",
  "version": "v2.1.0",
  "environment": "staging",
  "description": "Add Stripe v3 integration",
  "requested_by": "Alice Developer"
}
```

---

## Running Locally (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables (or edit config.py defaults)
export MYSQL_HOST=localhost
export MYSQL_USER=deployuser
export MYSQL_PASSWORD=deploypass
export MYSQL_DB=deployboard

python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App will be available at http://localhost:3000

---

## Project Structure

```
DeployBoard/
├── backend/
│   ├── app.py           # Flask app factory + startup
│   ├── config.py        # Configuration (reads env vars)
│   ├── extensions.py    # Shared SQLAlchemy instance
│   ├── models.py        # User and Deployment ORM models
│   ├── routes.py        # All API route handlers
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login form
│   │   │   ├── Dashboard.jsx       # Main view with stats + table
│   │   │   ├── CreateDeployment.jsx# New deployment request form
│   │   │   └── Approvals.jsx       # Approve / reject pending requests
│   │   ├── components/
│   │   │   └── DeploymentTable.jsx # Reusable deployments table
│   │   ├── App.jsx                 # Router + protected routes
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # All global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── database/
│   └── init.sql         # Schema + seed data (runs on first MySQL start)
│
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

### Backend
| Variable       | Default      | Description              |
|----------------|--------------|--------------------------|
| MYSQL_HOST     | localhost    | MySQL hostname           |
| MYSQL_PORT     | 3306         | MySQL port               |
| MYSQL_USER     | deployuser   | MySQL username           |
| MYSQL_PASSWORD | deploypass   | MySQL password           |
| MYSQL_DB       | deployboard  | Database name            |
| SECRET_KEY     | (insecure)   | Flask secret key         |

### Frontend
| Variable       | Default                   | Description         |
|----------------|---------------------------|---------------------|
| VITE_API_URL   | http://localhost:5000     | Backend API base URL |
