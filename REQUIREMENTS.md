# Business Requirement Document (BRD) & Technical Specification

## Project: CloudPulse — Enterprise Cloud Health & Incident Dashboard

### 1. Executive Summary & Objective
The objective of **CloudPulse** is to provide engineering, DevOps, and site reliability teams with an automated, real-time dashboard to monitor microservice health statuses, record latency metrics, and register operational incidents during deployment cycles across **Dev**, **Stage**, and **Production** environments.

---

### 2. Stakeholder & User Stories

| ID | User Role | User Story | Acceptance Criteria |
|---|---|---|---|
| **US-01** | Site Reliability Engineer (SRE) | As an SRE, I want to see the real-time operational status (Operational, Degraded, Down) and latency of critical services (API Gateway, Core Database, Cache Tier, Worker Pool). | Dashboard displays live cards with badges, latency values, and last checked timestamps. |
| **US-02** | DevOps Engineer | As a DevOps Engineer, I want automated health endpoints (`/health`) with memory and uptime metrics. | Endpoint returns HTTP 200 with JSON payload containing uptime, timestamp, and environment. |
| **US-03** | Incident Manager | As an Incident Manager, I want to report new incidents with title, severity level (Critical, Warning, Info), affected service, and description. | POST `/api/incidents` validates inputs, assigns a UUID, persists to state, and updates the UI instantly. |
| **US-04** | QA / Release Engineer | As a Release Engineer, I want CI/CD pipelines to fail fast if TypeScript types break, tests fail, or Docker builds break. | Pull requests fail automatically if `npm run typecheck`, `npm run test`, or container builds fail. |
| **US-05** | Cloud Architect | As a Cloud Architect, I want automated dev and staging deployments targeting Oracle Cloud Infrastructure (OCI). | Pushes to `develop` deploy to OCI Dev; pushes to `main` deploy to OCI Stage with automated health verification. |

---

### 3. System Architecture & Components

```
                    ┌─────────────────────────┐
                    │      Client Browser     │
                    └────────────┬────────────┘
                                 │ HTTP (Port 80/3000)
                    ┌────────────▼────────────┐
                    │  React + Vite Frontend  │
                    │   (NGINX Alpine in Prod) │
                    └────────────┬────────────┘
                                 │ REST API Calls (/api/*)
                    ┌────────────▼────────────┐
                    │ Node.js TypeScript API  │
                    │        (Express)        │
                    └────────────┬────────────┘
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌───────────────────┐           ┌───────────────────┐
       │   /health Probe   │           │ In-Memory Datastore│
       │ (OCI Liveness)    │           │ (Services & Logs) │
       └───────────────────┘           └───────────────────┘
```

---

### 4. Quality & Build-Fail Gates

1. **TypeScript Verification Gate**: `tsc --noEmit` must report 0 compiler errors.
2. **Unit & Integration Test Gate**: 100% passing tests for both Frontend and Backend components.
3. **Container Build Gate**: Multi-stage Docker builds must succeed without error and pass internal smoke tests.
4. **Environment Isolation**: Separate build artifacts and runtime environment variables for `dev` and `stage`.
5. **OCI Deployment Gate**: Health check verification post-deployment; auto-abort on probe failure.
