# MRAS - Medical Records Archival System
## Complete Development Plan

---

## 1. PROJECT OVERVIEW

**Project Name:** Medical Records Archival System with Information Retrieval Features (MRAS)

**Purpose:** A web-based, client-server system for long-term storage and retrieval of medical records that are no longer needed in the live Hospital Information System (HIS) or Electronic Health Record (EHR). Users access MRAS entirely through a web browser.

**Key Features:**
- Archive structured and unstructured records (text reports, PDFs, scanned images)
- Provide powerful information retrieval (IR) features to search and filter archived data
- Offer patient-centric views of historical records from multiple source systems
- Enforce role-based access, audit logging, and retention policies for legal and regulatory compliance

**Note:** MRAS does NOT replace operational HIS/EHR. It only stores read-only copies of historical records.

**Team Members:**
- Jyotirmoy Das (240103002)
- Dhrisit Mazumdar (240103007)
- Bhairab Kumar Mahanta (240103011)
- Jyotishman Kumar (240103029)

---

## 2. TECHNOLOGY STACK

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | ReactJS + TypeScript | Type safety, modern UI, component-based |
| **Backend API** | Node.js + Express | JavaScript consistency with frontend, large ecosystem |
| **Database** | PostgreSQL | Relational data, ACID compliance, healthcare data requirements |
| **Document Storage** | MinIO (S3-compatible) | Scalable binary storage for PDFs/images |
| **Search Engine** | Elasticsearch | Full-text search, OCR indexing, high-performance |
| **Authentication** | JWT (with LDAP/AD integration ready) | Secure stateless auth |
| **OCR Processing** | Tesseract OCR | Open-source, extensible |
| **Containerization** | Docker + Docker Compose | Easy deployment, reproducibility |
| **Styling** | Tailwind CSS | Rapid UI development |

---

## 3. SYSTEM ARCHITECTURE

### Three-Tier Web Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                          │
│   ReactJS + TypeScript Web UI (Browser)                            │
│   - Login, Dashboard, Search, Patient View, Document Viewer       │
│   - Admin Screens (Users, Data Sources, Retention, Reports)       │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTPS (TLS)
┌─────────────────────────────▼───────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│   Node.js + Express API Server                                     │
│   - Authentication & Authorization                                  │
│   - Business Logic (Ingestion, Search, Retention)                 │
│   - Service Layer (Patients, Documents, Reports)                   │
│   - Middleware (Auth, RBAC, Validation, Logging)                   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ Internal
┌─────────────────────────────▼───────────────────────────────────────┐
│                        DATA & SEARCH LAYER                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐     │
│   │ PostgreSQL   │  │ Elasticsearch │  │ MinIO File Storage  │     │
│   │ (Metadata)   │  │ (Search Index)│  │ (Document Blobs)    │     │
│   └──────────────┘  └──────────────┘  └──────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

### External Integrations
- HIS/EHR Systems (Data Sources)
- LDAP/Active Directory (Authentication)
- Email Server (SMTP alerts)

---

## 4. DATABASE SCHEMA DESIGN

### Core Tables

**patients** - Patient demographics and identifiers
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | VARCHAR | External patient identifier |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| date_of_birth | DATE | Date of birth |
| gender | VARCHAR | Gender |
| identifiers | JSONB | Additional identifiers |
| is_sensitive | BOOLEAN | Sensitive record flag |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**documents** - Document metadata
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to patients |
| title | VARCHAR | Document title |
| document_type | VARCHAR | Type (Lab Report, Imaging, etc.) |
| document_date | DATE | Document date |
| department | VARCHAR | Source department |
| source_system | VARCHAR | Source system name |
| content_text | TEXT | Extracted text (for search) |
| file_path | VARCHAR | Path to blob storage |
| mime_type | VARCHAR | File MIME type |
| retention_end_date | DATE | When retention expires |
| legal_hold | BOOLEAN | On legal hold flag |
| created_at | TIMESTAMP | Ingestion timestamp |

**data_sources** - Registered source systems
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Source name |
| connection_type | VARCHAR | CSV, Database, HL7/FHIR |
| connection_config | JSONB | Connection parameters |
| format_config | JSONB | Import format settings |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation timestamp |

**users** - User accounts
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| username | VARCHAR | Login username |
| email | VARCHAR | Email address |
| password_hash | VARCHAR | Hashed password |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation timestamp |

**roles** - Role definitions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Role name (HIM, Clinician, Admin, Auditor) |
| description | VARCHAR | Role description |
| permissions | JSONB | List of permissions |

**user_roles** - User-role assignments
| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | FK to users |
| role_id | UUID | FK to roles |

**retention_rules** - Retention policies
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | Rule | name |
| document_type | VARCHAR | Applicable document type |
| retention_years | INTEGER | Years to retain |
| created_at | TIMESTAMP | Creation timestamp |

**audit_logs** - Immutable audit trail
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users (nullable for system) |
| action | VARCHAR | Action type |
| resource_type | VARCHAR | Resource affected |
| resource_id | UUID | Resource ID |
| details | JSONB | Additional details |
| ip_address | VARCHAR | Client IP |
| timestamp | TIMESTAMP | Action timestamp |

**legal_holds** - Legal hold records
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| document_id | UUID | FK to documents |
| reason | VARCHAR | Hold reason |
| placed_by | UUID | FK to users |
| placed_at | TIMESTAMP | Hold placed timestamp |
| removed_at | TIMESTAMP | Hold removed (nullable) |

**ingestion_jobs** - Batch import tracking
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| data_source_id | UUID | FK to data_sources |
| status | VARCHAR | Running, Completed, Failed |
| total_records | INTEGER | Total processed |
| success_count | INTEGER | Successful imports |
| failure_count | INTEGER | Failed imports |
| started_at | TIMESTAMP | Start time |
| completed_at | TIMESTAMP | End time (nullable) |
| error_details | TEXT | Error log |

---

## 5. API ENDPOINTS (RESTful)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/me | Get current user |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/patients/:id | Get patient details |
| GET | /api/patients/:id/documents | Get patient's documents |
| GET | /api/patients/search | Search patients |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/documents | List documents (paginated) |
| GET | /api/documents/:id | Get document metadata |
| GET | /api/documents/:id/content | Get document binary |
| POST | /api/documents/export | Export documents (ROI) |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/search | Full-text search |
| GET | /api/search/suggest | Search suggestions |

### Ingestion (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/ingest | Trigger batch import |
| GET | /api/admin/ingest/history | Get ingestion history |
| GET | /api/admin/ingest/:id | Get specific job details |

### Retention (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/retention/expired | Get expired records |
| DELETE | /api/retention/purge | Purge records |
| POST | /api/retention/hold | Place legal hold |
| DELETE | /api/retention/hold/:id | Remove legal hold |

### Administration
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/admin/users | List/Create users |
| PUT/DELETE | /api/admin/users/:id | Update/Deactivate user |
| GET/POST | /api/admin/roles | List/Create roles |
| GET/POST | /api/admin/data-sources | List/Create data sources |
| GET | /api/admin/status | System status |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/usage | Usage statistics |
| GET | /api/reports/volume | Data volume report |
| GET | /api/reports/audit | Audit log export |

---

## 6. FRONTEND PAGES & COMPONENTS

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | /login | Username/password form, SSO button |
| Dashboard | / | Quick search, recent records, shortcuts |
| Search | /search | Search bar, filters, results grid |
| Patient View | /patients/:id | Demographics, document list |
| Document Viewer | /documents/:id | Content renderer, metadata |
| Admin - Users | /admin/users | User management table |
| Admin - Data Sources | /admin/sources | Source configuration |
| Admin - Retention | /admin/retention | Rules editor, purge review |
| Admin - Reports | /admin/reports | Usage, volume charts |
| Admin - Settings | /admin/settings | System configuration |

### Reusable Components
- `Button`, `Input`, `Select`, `DatePicker`
- `DataTable` with pagination, sorting, filtering
- `SearchBar` with autocomplete
- `DocumentCard`, `PatientCard`
- `Modal`, `Toast`, `LoadingSpinner`
- `Sidebar`, `Navbar`, `Breadcrumb`
- `FilterPanel`, `Pagination`

---

## 7. DEVELOPMENT PHASES

### Phase 1: Foundation (Week 1-2)
**Goal:** Set up project infrastructure and basic authentication

| Task | Description |
|------|-------------|
| 1.1 | Initialize Git repository with .gitignore |
| 1.2 | Set up Node.js project with package.json |
| 1.3 | Set up React + TypeScript project (Vite) |
| 1.4 | Configure Docker Compose (PostgreSQL, Elasticsearch, MinIO) |
| 1.5 | Create database migrations (patients, users, roles) |
| 1.6 | Implement JWT authentication system |
| 1.7 | Create basic login page |
| 1.8 | Set up project folder structure |

**Deliverable:** Working dev environment with auth

---

### Phase 2: Data Management (Week 3-4)
**Goal:** Core data models and data source integration

| Task | Description |
|------|-------------|
| 2.1 | Create data_sources table and API |
| 2.2 | Implement batch import service (CSV parsing) |
| 2.3 | Create patient table and consolidation logic |
| 2.4 | Implement document upload and blob storage |
| 2.5 | Create ingestion job tracking |
| 2.6 | Build admin data sources page |

**Deliverable:** Data import pipeline working

---

### Phase 3: Search & Retrieval (Week 5-6)
**Goal:** Full-text search and document viewing

| Task | Description |
|------|-------------|
| 3.1 | Integrate Elasticsearch |
| 3.2 | Implement document indexing pipeline |
| 3.3 | Add Tesseract OCR for scanned documents |
| 3.4 | Build search API with filters |
| 3.5 | Create search UI with results highlighting |
| 3.6 | Implement document viewer component |

**Deliverable:** Search and document viewing working

---

### Phase 4: Patient Management (Week 7)
**Goal:** Patient-centric views

| Task | Description |
|------|-------------|
| 4.1 | Create patient view page |
| 4.2 | Implement patient-document relationship |
| 4.3 | Add filtering and sorting for patient docs |
| 4.4 | Build export functionality (ROI) |
| 4.5 | Add within-document search |

**Deliverable:** Complete patient view functionality

---

### Phase 5: Security & Audit (Week 8-9)
**Goal:** RBAC and audit logging

| Task | Description |
|------|-------------|
| 5.1 | Implement RBAC middleware |
| 5.2 | Create role management UI |
| 5.3 | Add sensitive record marking |
| 5.4 | Implement complete audit logging |
| 5.5 | Add permission checks on all endpoints |
| 5.6 | Create audit log viewer (admin) |

**Deliverable:** Secure system with full audit trail

---

### Phase 6: Retention & Purge (Week 10-11)
**Goal:** Retention policies and purging

| Task | Description |
|------|-------------|
| 6.1 | Create retention rules table and API |
| 6.2 | Implement retention date calculation |
| 6.3 | Build expired records review UI |
| 6.4 | Implement controlled purging with confirmation |
| 6.5 | Add legal hold functionality |
| 6.6 | Log all purge actions |

**Deliverable:** Retention management complete

---

### Phase 7: Reports & Analytics (Week 12)
**Goal:** Reporting functionality

| Task | Description |
|------|-------------|
| 7.1 | Build usage report (searches, views, exports) |
| 7.2 | Build data volume report |
| 7.3 | Add CSV export for reports |
| 7.4 | Create reports dashboard UI |
| 7.5 | Add basic visualizations (charts) |

**Deliverable:** Reporting system complete

---

### Phase 8: Polish & Testing (Week 13-14)
**Goal:** Final refinements and bug fixes

| Task | Description |
|------|-------------|
| 8.1 | UI/UX refinement and styling |
| 8.2 | Error handling improvements |
| 8.3 | Unit tests (backend services) |
| 8.4 | Integration tests (API endpoints) |
| 8.5 | Frontend component tests |
| 8.6 | Bug fixes and edge cases |
| 8.7 | Performance optimization |

**Deliverable:** Production-ready system

---

## 8. SECURITY IMPLEMENTATION

### Authentication
- JWT tokens with 1-hour expiry
- Refresh tokens for session continuity
- Password hashing using bcrypt (cost factor 12)
- Failed login attempt tracking

### Authorization
- Role-based access control (RBAC)
- Four roles: HIM Staff, Clinician, Administrator, Auditor
- Permission-based route guards on frontend
- API middleware for permission checking

### Data Protection
- HTTPS only (TLS 1.2+)
- Data at rest encryption (PostgreSQL TDE)
- Sensitive patient records flag
- Audit logs protected from modification

### Audit Trail
- All login/logout events
- All search queries
- All document views
- All exports (ROI)
- All administrative changes
- Immutable append-only logs

---

## 9. KEY CHALLENGES & MITIGATION

| Challenge | Description | Mitigation |
|-----------|-------------|------------|
| Patient Matching | Consolidating records from multiple sources | Configurable matching rules (ID, name+DOB fuzzy match) |
| OCR Accuracy | Scanned documents may be unsearchable | Fallback to manual indexing; flag low-confidence extracts |
| Large Volumes | Supporting 1M+ records | Async processing queue; Elasticsearch; pagination; caching |
| Search Performance | Fast search on large dataset | Proper indexing; query optimization; result caching |
| Healthcare Compliance | Privacy and security requirements | Encryption at rest; audit trails; RBAC; regular reviews |

---

## 10. NON-FUNCTIONAL REQUIREMENTS

### Performance
- Search queries: < 3 seconds for 1M records
- Concurrent users: Support all HIM staff + clinicians simultaneously
- Background ingestion: Non-blocking during work hours

### Reliability
- Error handling with graceful degradation
- Comprehensive logging for debugging
- Data validation on all inputs

### Scalability
- Modular architecture for easy scaling
- Container-based deployment
- Separate storage from metadata

### Usability
- Simple, consistent UI
- Role-specific shortcuts on dashboard
- Online help tooltips

---

## 11. PROJECT STRUCTURE

```
MRAS/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Auth, RBAC, validation
│   │   ├── routes/            # API routes
│   │   ├── utils/             # OCR, file handling
│   │   └── index.ts           # Entry point
│   ├── migrations/            # Database migrations
│   ├── tests/                 # Backend tests
│   └── package.json
│
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API calls (axios)
│   │   ├── types/             # TypeScript interfaces
│   │   ├── context/           # React context (auth)
│   │   └── App.tsx            # Main app component
│   ├── tests/                 # Frontend tests
│   ├── index.html
│   └── package.json
│
├── docker/                    # Docker configurations
│   ├── docker-compose.yml     # Full stack
│   ├── postgres/
│   ├── elasticsearch/
│   └── minio/
│
├── docs/                      # Documentation
│   ├── API.md                 # API documentation
│   ├── DEPLOY.md              # Deployment guide
│   └── USER_MANUAL.md         # User guide
│
├── PLAN.md                    # This file
├── SRS.md                     # Requirements spec
├── README.md                  # Project readme
└── .gitignore
```

---

## 12. DELIVERABLES

1. **Working Web Application** - Full MRAS system deployed and functional
2. **Source Code** - Complete codebase in Git repository
3. **Documentation** - API docs, deployment guide, user manual
4. **Test Suite** - Unit and integration tests
5. **SRS Report** - IEEE-compliant requirements document with diagrams

---

## 13. TIMELINE SUMMARY

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | 2 weeks | Dev environment, auth |
| Phase 2 | 2 weeks | Data import pipeline |
| Phase 3 | 2 weeks | Search system |
| Phase 4 | 1 week | Patient views |
| Phase 5 | 2 weeks | Security, RBAC |
| Phase 6 | 2 weeks | Retention policies |
| Phase 7 | 1 week | Reports |
| Phase 8 | 2 weeks | Testing, polish |
| **Total** | **14 weeks** | Complete system |

---

*This plan is based on the SRS.md requirements specification. All functional requirements (FR-1.1 through FR-7.3) and non-functional requirements are addressed in this plan.*