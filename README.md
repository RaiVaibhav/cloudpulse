# CloudPulse - Enterprise Fullstack Monorepo with Automated CI/CD

[![CI Quality Gate](https://img.shields.io/badge/CI-Automated%20Gates-blue.svg)](#ci-quality-gates--build-fail-checks)
[![GitHub Container Registry](<https://img.shields.io/badge/Registry-GHCR%20(Free)-green.svg>)](https://github.com/features/packages)
[![Oracle Cloud](https://img.shields.io/badge/Oracle%20Cloud-OCIR%20%2B%20DevOps-F80000.svg)](https://www.oracle.com/cloud/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178c6.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ed.svg)](https://www.docker.com/)

> **Project Overview**: An end-to-end fullstack cloud health and telemetry observability platform (**CloudPulse**), built from scratch to demonstrate full-lifecycle engineering: from requirements specification to TypeScript architecture, automated containerization, strict build-fail quality gates, and automated multi-environment (Dev & Stage) deployment workflows publishing to **GitHub Container Registry (GHCR)** and **Oracle Cloud Infrastructure (OCI)**.

---

## 🏗️ Architecture & Component Topology

```
                                  ┌───────────────────────────┐
                                  │      Client Browser       │
                                  └─────────────┬─────────────┘
                                                │ Port 80 (Prod) / 3000 (Dev)
                                  ┌─────────────▼─────────────┐
                                  │   Frontend (React + Vite) │
                                  │    TypeScript / Vitest    │
                                  │   NGINX Alpine in Prod    │
                                  └─────────────┬─────────────┘
                                                │ REST API (/api/*, /health)
                                  ┌─────────────▼─────────────┐
                                  │   Backend (Express + TS)  │
                                  │      Jest / Supertest     │
                                  │    Port 4000 (Node 20)    │
                                  └─────────────┬─────────────┘
                               ┌────────────────┴────────────────┐
                               ▼                                 ▼
                 ┌───────────────────────────┐     ┌───────────────────────────┐
                 │   OCI Health Check Probe  │     │ In-Memory State & Metrics │
                 │      (/health 200 OK)     │     │ (Services & Incident Log) │
                 └───────────────────────────┘     └───────────────────────────┘
```

---

## 📁 Repository Structure

```
setup-oracle-ci-cd/
├── REQUIREMENTS.md                    # Business Requirements & Specification
├── README.md                          # Documentation and setup runbook
├── package.json                       # Monorepo workspace orchestrator
├── docker-compose.yml                 # Local Development compose configuration
├── docker-compose.stage.yml           # Staging environment simulation configuration
├── .gitignore                         # Git exclusion rules
│
├── .agents/                           # Antigravity Agent Configuration
│   ├── rules/
│   │   ├── coding-standards.md        # Strict TypeScript & container rules
│   │   └── devops-ci-cd.md            # CI/CD branch gating & OCI standards
│   └── skills/
│       └── oracle-ci-cd-runbook/
│           └── SKILL.md               # OCI operational runbook & troubleshooting
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # PR Quality Gate (Typecheck + Test + Docker Smoke)
│       ├── deploy-dev.yml             # CD workflow deploying to OCI Dev
│       └── deploy-stage.yml           # CD workflow deploying to OCI Stage with rollback
│
├── .oci/
│   ├── build_spec.yaml                # Native OCI DevOps Build Pipeline specification
│   └── deploy_spec.yaml               # Native OCI DevOps Deployment Pipeline specification
│
├── backend/
│   ├── Dockerfile                     # Multi-stage production container
│   ├── Dockerfile.dev                 # Hot-reloading development container
│   ├── jest.config.js                 # Jest unit/integration test config
│   ├── package.json                   # Backend dependencies & scripts
│   ├── tsconfig.json                  # TypeScript compiler settings
│   └── src/
│       ├── app.ts                     # Express application factory
│       ├── server.ts                  # Server entrypoint with graceful shutdown
│       ├── types.ts                   # Core interfaces & data models
│       ├── routes/
│       │   ├── health.ts              # /health probe endpoint
│       │   ├── services.ts            # /api/services status & latency endpoints
│       │   └── incidents.ts           # /api/incidents audit & log endpoints
│       └── __tests__/
│           ├── health.test.ts         # Health endpoint tests
│           └── incidents.test.ts      # Input validation & mutation tests
│
└── frontend/
    ├── Dockerfile                     # Multi-stage container (Vite build -> Nginx)
    ├── Dockerfile.dev                 # Development container
    ├── nginx.conf                     # Nginx proxy & SPA routing configuration
    ├── package.json                   # Frontend dependencies & scripts
    ├── tsconfig.json                  # React TypeScript compiler settings
    ├── tsconfig.node.json             # Vite configuration TypeScript settings
    ├── vite.config.ts                 # Vite bundler & Vitest settings
    ├── index.html                     # HTML root template with fonts
    └── src/
        ├── main.tsx                   # React DOM root entrypoint
        ├── App.tsx                    # Main dashboard container & live state
        ├── index.css                  # Custom design system (dark mode, glassmorphism)
        ├── types.ts                   # Data model types matching backend contracts
        ├── components/
        │   ├── Header.tsx             # Header bar with live pulse & region badge
        │   ├── ServiceCard.tsx        # Microservice status & latency card
        │   ├── IncidentList.tsx       # Audit list with severity badges
        │   └── IncidentModal.tsx      # Modal form with validation
        └── __tests__/
            └── App.test.tsx           # Component rendering & modal interaction tests
```

---

## ⚡ Quick Start: Local Development

### Option 1: Native Node.js & Workspaces

1. **Install all dependencies across both packages:**

   ```bash
   npm install
   ```

2. **Execute all Typecheck and Test validation suites:**

   ```bash
   npm run ci:check
   ```

   _(This runs `npm run typecheck`, `npm run test`, and `npm run build` across frontend and backend)._

3. **Start both Backend and Frontend concurrently:**

   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:4000`
   - Health Probe: `http://localhost:4000/health`

---

### Option 2: Docker Compose (Recommended)

1. **Launch the development environment:**

   ```bash
   docker compose up --build
   ```

   _Features live hot-reloading for code changes in both frontend and backend._

2. **Simulate the Production / Staging multi-stage containers:**

   ```bash
   docker compose -f docker-compose.stage.yml up --build
   ```

   - Frontend is compiled into static production assets served via **NGINX Alpine** on port `80`.
   - Backend runs in a lean, hardened Node Alpine image on port `4000`.

---

## 🛡️ CI Quality Gates & Build-Fail Checks

The continuous integration pipeline (`.github/workflows/ci.yml`) enforces zero-defect gates:

| Gate                          | Check Command                        | Failure Condition                  | Impact                       |
| ----------------------------- | ------------------------------------ | ---------------------------------- | ---------------------------- |
| **Backend Typecheck**         | `npm run typecheck` (`tsc --noEmit`) | Any compiler warning/error         | Pipeline terminates (Exit 1) |
| **Backend Test Suite**        | `npm run test` (Jest + Supertest)    | Any failing unit/integration test  | Pipeline terminates (Exit 1) |
| **Frontend Typecheck**        | `npm run typecheck` (`tsc --noEmit`) | Missing/invalid TypeScript types   | Pipeline terminates (Exit 1) |
| **Frontend Test Suite**       | `npm run test` (Vitest + JSDOM)      | Component rendering or logic break | Pipeline terminates (Exit 1) |
| **Frontend Production Build** | `npm run build` (`vite build`)       | Asset compilation error            | Pipeline terminates (Exit 1) |

---

## ☁️ Oracle Cloud Infrastructure (OCI) Deployment Workflow

This project supports two production-ready deployment methodologies:

### Methodology A: GitHub Actions -> OCI (OCIR + Compute / OKE)

1. **Dev Environment Promotion (`.github/workflows/deploy-dev.yml`)**:
   - **Trigger**: Merge or push to `develop` branch.
   - **Workflow**:
     1. Executes full CI Quality Gate.
     2. Authenticates with **Oracle Cloud Infrastructure Registry (OCIR)**.
     3. Builds and pushes images tagged `dev-${SHA}` and `dev-latest`.
     4. Deploys to Dev namespace / instance on OCI.
     5. Verifies `/health` endpoint response.

2. **Staging Environment Promotion (`.github/workflows/deploy-stage.yml`)**:
   - **Trigger**: Merge or push to `main` branch.
   - **Workflow**:
     1. Strict pre-deployment check.
     2. Builds and tags production-ready images with `stage-${SHA}` and `stage-latest`.
     3. Performs zero-downtime rolling update on OCI.
     4. Executes automated health check probe against staging URL.
     5. **Rollback Trigger**: If the health check fails within 60s, automatically reverts to the previous stable release.

---

### Methodology B: Native OCI DevOps Service

The repository includes native OCI DevOps pipeline definitions:

- **`.oci/build_spec.yaml`**: Utilized by OCI DevOps Build Pipelines to compile, test, and register container images in OCIR directly inside Oracle Cloud.
- **`.oci/deploy_spec.yaml`**: Utilized by OCI DevOps Deployment Pipelines for automated zero-downtime rolling deployments to OCI Container Instances or OKE with auto-rollback.

---

## 🔑 OCI GitHub Secrets Reference

To link this repository to your Oracle Cloud tenancy, populate the following repository secrets:

| Secret                  | Description                       |
| ----------------------- | --------------------------------- |
| `OCI_TENANCY_OCID`      | Tenancy OCID from OCI Console     |
| `OCI_USER_OCID`         | Dedicated CI/CD User OCID         |
| `OCI_FINGERPRINT`       | OCI API Signing Key Fingerprint   |
| `OCI_KEY_FILE`          | Base64-encoded private key        |
| `OCI_REGION`            | OCI Region (e.g. `us-ashburn-1`)  |
| `OCI_TENANCY_NAMESPACE` | Tenancy Object Storage Namespace  |
| `OCI_REGISTRY_USER`     | `<tenancy-namespace>/<username>`  |
| `OCI_AUTH_TOKEN`        | OCI Auth Token generated for OCIR |
