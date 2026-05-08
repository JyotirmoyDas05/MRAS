# MRAS - Medical Records Archival System

A web-based, client-server system for long-term storage and retrieval of medical records from Hospital Information Systems (HIS) and Electronic Health Records (EHR).

---

## Features

| Feature | Description |
|---------|-------------|
| **Data Ingestion** | Import records from multiple sources (CSV, HL7/FHIR, PDF, scanned images) |
| **Full-Text Search** | Elasticsearch-powered search with OCR support for scanned documents |
| **Patient Views** | Consolidated patient history across all source systems |
| **Role-Based Access** | RBAC with HIM Staff, Clinician, Administrator, Auditor roles |
| **Retention Policies** | Configurable retention rules with legal purge capability |
| **Audit Logging** | Complete audit trail for compliance and regulatory requirements |
| **Reports** | Usage statistics and data volume analytics |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (metadata, users, audit logs) |
| Search | Elasticsearch (full-text search, OCR indexing) |
| Storage | MinIO S3-compatible (document blobs) |
| OCR | Tesseract.js |
| Container | Docker + Docker Compose |

---

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL client (optional, for direct DB access)

---

## Quick Start

### 1. Start Infrastructure Services

```bash
cd docker
docker-compose up -d
```

This starts:
- **PostgreSQL** on port `5432` (user: `mras_user`, password: `mras_password`)
- **Elasticsearch** on port `9200`
- **MinIO** on port `9000` (console: `9001`, user: `minioadmin`, password: `minioadmin`)

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Project Structure

```
MRAS/
├── backend/               # Express API server
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models (TypeORM)
│   │   ├── middleware/    # Auth, RBAC, validation
│   │   ├── routes/        # API routes
│   │   └── utils/         # OCR, file handling
│   ├── migrations/        # Database migrations
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API calls (axios)
│   │   ├── types/         # TypeScript interfaces
│   │   └── context/       # React context (auth)
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── docker/                # Docker configurations
│   └── docker-compose.yml # PostgreSQL, Elasticsearch, MinIO
│
├── docs/                  # Documentation
│   ├── API.md            # API documentation
│   ├── DEPLOY.md         # Deployment guide
│   └── USER_MANUAL.md    # User guide
│
├── PLAN.md               # Development plan
├── SRS.md                # Requirements specification
└── README.md             # This file
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients/:id` - Get patient details
- `GET /api/patients/:id/documents` - Get patient's documents

### Documents
- `GET /api/documents` - List documents (paginated)
- `GET /api/documents/:id` - Get document metadata
- `GET /api/documents/:id/content` - Get document binary
- `POST /api/documents/export` - Export documents (ROI)

### Search
- `GET /api/search` - Full-text search

### Administration
- `GET/POST /api/admin/users` - User management
- `GET/POST /api/admin/data-sources` - Data source config
- `GET /api/admin/status` - System status

---

## Development Phases

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 2 weeks | Project setup, auth |
| Phase 2 | 2 weeks | Data import pipeline |
| Phase 3 | 2 weeks | Search system |
| Phase 4 | 1 week | Patient views |
| Phase 5 | 2 weeks | Security, RBAC |
| Phase 6 | 2 weeks | Retention policies |
| Phase 7 | 1 week | Reports |
| Phase 8 | 2 weeks | Testing, polish |

---

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- HTTPS only (TLS)
- Data at rest encryption
- Complete audit logging
- Sensitive record marking

---

## Team

| Name | Roll Number |
|------|-------------|
| Jyotirmoy Das | 240103002 |
| Dhrisit Mazumdar | 240103007 |
| Bhairab Kumar Mahanta | 240103011 |
| Jyotishman Kumar | 240103029 |

---

## License

MIT