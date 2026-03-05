# DeployBoard

> A full-stack Deployment Request & Approval System built with React, Flask, and MySQL — fully containerized with Docker Compose.

---

## What is DeployBoard?

DeployBoard simulates a real-world DevOps deployment approval workflow.

- **Developers** submit deployment requests
- **Approvers** review and approve or reject them
- Approved deployments can be marked as **Deployed**
- Everything runs in Docker with a single command

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Axios             |
| Backend  | Python, Flask, Flask-SQLAlchemy   |
| Database | MySQL 8.0                         |
| DevOps   | Docker, Docker Compose            |

---

## Getting Started

### Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run the app

```bash
git clone https://github.com/your-username/DeployBoard.git
cd DeployBoard
docker compose up --build
```

Wait about 30 seconds for MySQL to initialize, then open:

| Service  | URL                        |
|----------|----------------------------|
| Frontend | `http://localhost:3000`    |
| Backend  | `http://localhost:5000/api`|
| MySQL    | `localhost:3306`           |

### Stop the app

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

---

## Demo Accounts

| Role      | Email               | Password    |
|-----------|---------------------|-------------|
| Developer | dev@demo.com        | dev123      |
| Approver  | approver@demo.com   | approver123 |

---

## Features

- User login with role-based access
- Submit deployment requests (app name, version, environment, description)
- Dashboard with live stats (total, pending, approved, deployed)
- Approve or reject pending deployments
- Mark approved deployments as deployed
- Delete deployment records
- Seed data pre-loaded on first run

---

## Deployment Lifecycle

```
pending  →  approved  →  deployed
         →  rejected
```

---

## API Endpoints

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | `/api/login`                      | Login with email and password      |
| GET    | `/api/deployments`                | Get all deployment requests        |
| POST   | `/api/deployments`                | Create a new deployment request    |
| PUT    | `/api/deployments/:id/approve`    | Approve a pending deployment       |
| PUT    | `/api/deployments/:id/reject`     | Reject a pending deployment        |
| PUT    | `/api/deployments/:id/deploy`     | Mark an approved deployment as deployed |
| DELETE | `/api/deployments/:id`            | Delete a deployment record         |

---

## Project Structure

```
DeployBoard/
├── backend/
│   ├── app.py            # App factory and startup
│   ├── config.py         # Configuration from environment variables
│   ├── extensions.py     # Shared SQLAlchemy instance
│   ├── models.py         # User and Deployment models
│   ├── routes.py         # API route handlers
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateDeployment.jsx
│   │   │   └── Approvals.jsx
│   │   ├── components/
│   │   │   └── DeploymentTable.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── database/
│   └── init.sql          # Schema and seed data
│
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

### Backend

| Variable        | Default     | Description           |
|-----------------|-------------|-----------------------|
| `MYSQL_HOST`    | localhost   | MySQL hostname        |
| `MYSQL_PORT`    | 3306        | MySQL port            |
| `MYSQL_USER`    | deployuser  | MySQL username        |
| `MYSQL_PASSWORD`| deploypass  | MySQL password        |
| `MYSQL_DB`      | deployboard | Database name         |
| `SECRET_KEY`    | (insecure)  | Flask secret key      |

### Frontend

| Variable       | Default                 | Description          |
|----------------|-------------------------|----------------------|
| `VITE_API_URL` | `http://localhost:5000` | Backend API base URL |

---

## Running Locally Without Docker

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt

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

---

## License

MIT
