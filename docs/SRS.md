# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Medical Records Archival System with Information Retrieval Features (MRAS)

**Version:** 1.2  
**Date:** 07-05-26  
**Prepared by:** Team ContextIssues  
**Course:** Software Development (4th Sem)

***

## Table of Contents
1. Introduction  
   1.1 Purpose  
   1.2 Project Scope  
   1.3 Environmental Characteristics  
   1.4 Definitions and Acronyms  
   1.5 References  
2. Overall Description  
   2.1 Product Perspective  
   2.2 Product Features  
   2.3 Web Application Architecture (Overview)  
   2.4 User Classes and Characteristics  
   2.5 Operating Environment  
   2.6 Design and Implementation Constraints  
   2.7 User Documentation  
   2.8 Assumptions and Dependencies  
3. External Interface Requirements  
   3.1 User Interfaces  
   3.2 Hardware Interfaces  
   3.3 Software Interfaces  
   3.4 Communications Interfaces  
4. System Features (Functional Requirements)  
   4.1 Data Ingestion and Archival  
   4.2 Patient and Record Management  
   4.3 Information Retrieval and Search  
   4.4 Security, Privacy, and Access Control  
   4.5 Retention and Purge  
   4.6 Reporting and Analytics  
   4.7 System Administration  
5. Other Non‑Functional Requirements  
   5.1 Performance Requirements  
   5.2 Safety Requirements  
   5.3 Security Requirements  
   5.4 Software Quality Attributes  
6. Web‑Based Architecture Diagrams (For Report)  
7. Goals of Implementation (Non‑binding)

***

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes the requirements of the **Medical Records Archival System with Information Retrieval Features (MRAS)**. It defines what the system should do and the constraints under which it must operate, so that developers, testers, and stakeholders have a common understanding of the system behaviour.

### 1.2 Project Scope
MRAS is a **web‑based, client–server system** for long‑term storage and retrieval of medical records that are no longer needed in the live Hospital Information System (HIS) or Electronic Health Record (EHR). Users access MRAS entirely through a web browser; all business logic and data processing run on the application server.

The system will:
- Archive structured and unstructured records (text reports, PDFs, scanned images).
- Provide powerful information retrieval (IR) features to search and filter archived data.
- Offer patient‑centric views of historical records from multiple source systems.
- Enforce role‑based access, audit logging, and retention policies for legal and regulatory compliance.

MRAS does **not** replace operational HIS/EHR. It only stores read‑only copies of historical records.

### 1.3 Environmental Characteristics
- Deployment in a hospital or clinic IT environment.  
- Users access the system from hospital workstations over the intranet using standard browsers.  
- Data protection and privacy rules apply to all stored and transmitted information.

### 1.4 Definitions and Acronyms

| Term | Meaning |
|------|---------|
| MRAS | Medical Records Archival System |
| HIS | Hospital Information System |
| EHR | Electronic Health Record |
| HIM | Health Information Management |
| IR  | Information Retrieval |
| ROI | Release of Information |
| OCR | Optical Character Recognition |

### 1.5 References
- Course notes on IEEE‑style SRS and requirement categories.  
- Prof. Rajib Mall, *Fundamentals of Software Engineering* (SRS organisation and requirement types).

***

## 2. Overall Description

### 2.1 Product Perspective

MRAS is a new, independent **web application** that will coexist with existing HIS/EHR and lab systems. Historical data is exported from these systems and imported into MRAS. MRAS then becomes the single point of access for archived records.

High‑level view:
- **Input:** data exports (database dumps, CSV, HL7/FHIR messages, PDFs, scanned images) from HIS/EHR and other clinical systems.
- **Processing:** server‑side ingestion services, normalization, and indexing for search.
- **Output:** archived records, search results, and exports delivered through a browser‑based UI.

### 2.2 Product Features

| Feature Group | Brief Description |
|---------------|-------------------|
| Data Ingestion | Import records from multiple sources, normalize and store in archive. |
| IR & Search | Full‑text and filtered search over archived records. |
| Patient View | Consolidated patient history across all source systems. |
| Security & Audit | Authentication, authorization, and detailed audit logging. |
| Retention & Purge | Apply retention policies and legally purge records. |
| Reporting | Basic usage, compliance, and data volume reporting. |
| Administration | Configure users, roles, data sources, and system parameters. |

### 2.3 Web Application Architecture (Overview)

MRAS follows a standard **three‑tier web architecture**:

- **Presentation layer (client):** web browser UI built with ReactJs and Typescript for Type Safety.  
- **Application layer (server):** web server and application logic handling HTTP requests, enforcing business rules, and orchestrating ingestion and search.  
- **Data and search layer (backend):** relational database for metadata, document storage for binary files, and a search index for IR.

#### Basic architecture:

![ Architecture Diagram ](/assets/Architecture-diagram.excalidraw.png)

The final report should include a neat block diagram using this structure.

### 2.4 User Classes and Characteristics

| User Class | Typical Tasks | Characteristics |
|-----------|---------------|-----------------|
| HIM / Records Staff | Monitor ingestion, manage retention rules, handle ROI requests | Familiar with records workflows; moderate computer skills |
| Clinicians | Search and view historical patient records | Need quick, simple access; limited time for training |
| Administrators / IT | Manage users/roles, configure data sources, monitor health | Technical; comfortable with configuration and logs |
| Auditors / Legal | Search and export complete record sets for cases/audits | Need traceability and accurate audit logs |

### 2.5 Operating Environment
- **Server side:** Linux/Windows server or compliant cloud instance, running web server, application server, database, and search engine.  
- **Client side:** Modern web browsers (Chrome/Firefox/Edge) on hospital workstations.  
- **Network:** Hospital intranet with secure connectivity; optional VPN for remote access.

### 2.6 Design and Implementation Constraints
- Must follow healthcare data privacy/security laws for stored records.  
- All browser–server communication must use HTTPS.  
- Data at rest must be stored in encrypted form.  
- System should be designed to store records for many years and large volumes.  
- Implementation should use commonly available web technologies (HTTP, REST, relational DB, standard web framework).

### 2.7 User Documentation
- User manual for HIM staff and clinicians (search, view, export, basic troubleshooting).  
- Administrator manual (installation, configuration, integration, monitoring, backup).  
- Online help integrated into the web UI for commonly used screens.

### 2.8 Assumptions and Dependencies
- Source systems can export data in agreed formats (database dump, CSV, HL7/FHIR, PDF, etc.).  
- An identity management system (e.g., LDAP/Active Directory) is available for login integration.  
- Adequate server hardware or cloud resources will be provided.  
- OCR quality is good enough for most scanned documents; a few may remain partially unsearchable.

***

## 3. External Interface Requirements

### 3.1 User Interfaces

Main web UI elements:
- **Login Screen:** username/password and optional “Sign in with SSO” button; clear error messages for failed login.  
- **Dashboard:** quick access to patient search, recent records, and role‑specific shortcuts.  
- **Search Screen:** search box, filters (date range, document type, department, source system), and results table.  
- **Patient View:** patient demographics and list of archived documents for that patient.  
- **Document Viewer:** document content rendered in the browser with highlighted search terms and metadata panel; export/print buttons.  
- **Admin Screens:** user/role management, data source configuration, retention rules, reports, and basic system status.

### 3.2 Hardware Interfaces
- Runs on standard server machines or virtual machines; no specialized hardware devices required.  
- Uses existing hospital printers via the browser’s print function for paper output.

### 3.3 Software Interfaces
- **Authentication:** integration with LDAP/Active Directory for user credentials and roles.  
- **Data Sources:** import from HIS/EHR and lab systems via exports (CSV, database dumps, HL7/FHIR messages, or PDFs).  
- **Storage:** relational database for patient and document metadata; file or blob storage for document contents; search engine for IR index.

### 3.4 Communications Interfaces
- Browser ↔ server: HTTPS (TLS) over the hospital intranet.  
- Data ingestion: secure channels such as SFTP or VPN for transferring export files.  
- Optional SMTP interface for sending email alerts to administrators (e.g., ingestion failures, low storage).

***

## 4. System Features (Functional Requirements)

### 4.1 Data Ingestion and Archival

**Description:** Import and store historical records from different source systems into a unified web‑based archive.

| ID | Requirement |
|----|-------------|
| FR‑1.1 | The system shall allow an administrator to register each data source with connection details and data format. |
| FR‑1.2 | The system shall support batch import of records from each registered data source. |
| FR‑1.3 | The system shall convert imported records into a common internal format and store them with metadata (patient, date, type, source). |
| FR‑1.4 | The system shall, where possible, perform OCR on scanned/image documents to extract text for indexing. |
| FR‑1.5 | The system shall validate basic required fields (e.g., patient identifier, date, document type) and log records that fail validation. |
| FR‑1.6 | The system shall log ingestion summary information (total records, successes, failures) for each batch run. |

### 4.2 Patient and Record Management

**Description:** Provide a consolidated web view of records for each patient.

| ID | Requirement |
|----|-------------|
| FR‑2.1 | The system shall consolidate records that belong to the same patient using configurable matching rules (e.g., ID, name and date of birth). |
| FR‑2.2 | The system shall display core patient demographics (name, date of birth, gender, identifiers) on the patient view screen. |
| FR‑2.3 | The system shall list all archived documents for a patient with key metadata (title, type, date, department, source). |
| FR‑2.4 | The system shall allow filtering and sorting of the patient’s document list by date, type, and source. |
| FR‑2.5 | The system shall allow authorized users to export one or more selected documents for Release of Information (ROI). |

### 4.3 Information Retrieval and Search

**Description:** Enable efficient search and retrieval of records across the archive through the web UI.

| ID | Requirement |
|----|-------------|
| FR‑3.1 | The system shall support full‑text search over archived records using a keyword query. |
| FR‑3.2 | The system shall support patient‑scoped search where results are limited to a specific patient. |
| FR‑3.3 | The system shall support filters on search results (date range, document type, department, source system). |
| FR‑3.4 | The system shall display search results sorted by relevance and show short snippets with highlighted query terms. |
| FR‑3.5 | The system shall allow within‑document search for a keyword in the currently viewed document. |
| FR‑3.6 | The system may allow users to save search queries for quick reuse (optional if time permits). |

### 4.4 Security, Privacy, and Access Control

**Description:** Protect patient data using web‑based authentication, authorization, and auditing.

| ID | Requirement |
|----|-------------|
| FR‑4.1 | The system shall require users to authenticate before accessing any functionality. |
| FR‑4.2 | The system shall implement role‑based access control (RBAC) with at least roles for HIM staff, clinician, auditor, and administrator. |
| FR‑4.3 | The system shall check user permissions before allowing search, view, export, purge, or configuration actions. |
| FR‑4.4 | The system shall support marking certain patients or records as sensitive and restricting them to specific users/roles. |
| FR‑4.5 | The system shall record audit log entries for logins, searches, record views, exports, and administrative changes. |

### 4.5 Retention and Purge

**Description:** Apply retention rules to control how long records are kept and support legal purging.

| ID | Requirement |
|----|-------------|
| FR‑5.1 | The system shall allow administrators to define retention rules based on document type and/or other metadata. |
| FR‑5.2 | The system shall automatically determine the retention end date for each record using the defined rules. |
| FR‑5.3 | The system shall present records whose retention period has expired in a review list. |
| FR‑5.4 | The system shall support controlled purging of records from the archive with confirmation prompts. |
| FR‑5.5 | The system shall log purge actions with record identifiers, date/time, and the user who approved the purge. |
| FR‑5.6 | The system shall allow placing records on legal hold, preventing their purge until the hold is removed. |

### 4.6 Reporting and Analytics

**Description:** Provide simple reports for usage, compliance, and data volume.

| ID | Requirement |
|----|-------------|
| FR‑6.1 | The system shall provide a usage report showing numbers of searches, views, and exports per user and time period. |
| FR‑6.2 | The system shall provide a data volume report showing total number of records and approximate storage consumed, optionally by document type or source. |
| FR‑6.3 | The system shall allow exporting reports in at least one common format (e.g., CSV or PDF). |

### 4.7 System Administration

**Description:** Manage configuration, users, and basic system health via web admin screens.

| ID | Requirement |
|----|-------------|
| FR‑7.1 | The system shall allow administrators to create, update, and deactivate user accounts and assign roles. |
| FR‑7.2 | The system shall allow administrators to configure data source connections and ingestion schedules. |
| FR‑7.3 | The system shall provide a basic status view showing recent ingestion jobs, error counts, and storage usage. |

***

## 5. Other Non‑Functional Requirements

### 5.1 Performance Requirements
- Typical search queries should return results within a few seconds for up to about one million records under normal load.
- The system should support the expected number of concurrent hospital users (for example, all HIM staff and a set of clinicians) without noticeable slowdown.
- Background ingestion should not make the interactive web UI unusably slow during normal working hours.

### 5.2 Safety Requirements
- MRAS shall only store and display archived records; it shall not modify clinical data.
- MRAS shall display a note that archived data may not be up to date and that the live HIS/EHR should be checked for current patient information.

### 5.3 Security Requirements
- All browser–server communication shall use HTTPS.
- Archived data shall be stored in encrypted form.
- Passwords/credentials shall be stored securely (hashed or managed by the identity provider).
- Audit logs shall be protected from modification and accessible only to authorized roles.

### 5.4 Software Quality Attributes

| Attribute | Requirement |
|----------|------------|
| Maintainability | The system should use a modular structure (UI, business logic, data access) so that components can be changed with minimal impact. |
| Portability | The system should run on standard server platforms and be deployable on virtual machines or containers. |
| Usability | Web screens should be simple and consistent so that new users can perform common tasks (search, view) with minimal training. |
| Reliability | The system should handle errors in ingestion and search gracefully and log them for later analysis. |
| Scalability | The design should allow adding more storage or processing power if the volume of records grows. |

***

## 6. Web‑Based Architecture Diagrams (For Report)

To reach the expected page count and format and clearly present the design, the following diagrams are included in the report:

1. **Context Diagram:**
   - MRAS web application at the centre.
   - External entities: HIS/EHR systems (data sources), LDAP/Active Directory, email server, and user classes (Clinician, HIM Staff, Admin, Auditor).

![ Context Diagram ](/assets/context-diagram.excalidraw.png)


2. **High‑Level Web Architecture Diagram:**
   - Browser clients on the left.
   - Web/Application server in the middle.
   - Database, search index, and document storage on the right.
   - All arrows labelled with HTTPS or internal connections.

![ High Level Architecture Diagram ](/assets/High-Architecture-diagram.excalidraw.png)

3. **Use‑Case Diagram (Optional but recommended):**
   - Actors: Clinician, HIM Staff, Admin, Auditor.
   - Use cases: Search Records, View Patient History, Export Records, Configure Data Sources, Manage Retention, View Reports.

![ Use-case Diagram ](/assets/use-case-diagram.excalidraw.png)

***

## 7. Goals of Implementation (Non‑binding)

Goals are general suggestions and are **not** used for acceptance testing.

- Keep the codebase simple and readable so that future students or developers can extend it.
- Use clear separation of concerns so that new search features or filters can be added easily.
- Design the configuration (data sources, roles, retention rules) so that the same web application can be reused in different hospitals with minimal changes.

***

*End of Document*