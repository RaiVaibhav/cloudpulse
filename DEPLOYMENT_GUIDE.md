# CloudPulse — Complete Architecture & Deployment Runbook

This guide breaks down every component in this repository: what it does, how it works, and how to trigger real automated deployments to **GitHub Container Registry (GHCR)** and **Oracle Cloud (OCI)** with zero credit cards required.

---

## 🏛️ System Architecture: Component by Component

```
                                      ┌───────────────────────────────┐
                                      │     Client Browser (User)     │
                                      └───────────────┬───────────────┘
                                                      │ HTTP Port 80 (Prod) / 3000 (Dev)
                                      ┌───────────────▼───────────────┐
                                      │    Frontend (React + Vite)    │
                                      │  NGINX Alpine (Reverse Proxy) │
                                      └───────────────┬───────────────┘
                                                      │ Proxy /api/* & /health
                                      ┌───────────────▼───────────────┐
                                      │     Backend (Node + Express)  │
                                      │      Port 4000 (TypeScript)   │
                                      └───────────────┬───────────────┘
                                   ┌──────────────────┴──────────────────┐
                                   ▼                                     ▼
                     ┌───────────────────────────┐         ┌───────────────────────────┐
                     │    OCI Health Probe Gate  │         │ In-Memory Telemetry State │
                     │      (/health 200 OK)     │         │ (Services & Incident Log) │
                     └───────────────────────────┘         └───────────────────────────┘
```

---

### Component 1: Frontend (`/frontend`)
* **Framework**: React 18 with Vite and TypeScript (`strict: true`).
* **Design System**: Tailored dark-mode glassmorphic theme in `index.css`, with pulsating live health badges, latency metric cards, and responsive microservice status cards.
* **Incident Modal**: An interactive form to log incidents (title, service, severity, description) with instant state updates.
* **Testing**: Vitest + React Testing Library (`src/__tests__/App.test.tsx`), verifying DOM elements, status badges, and user interaction.
* **Containerization**:
  - `Dockerfile.dev`: Runs Vite development server on port 3000 with host binding.
  - `Dockerfile`: Multi-stage production build. Stage 1 compiles TypeScript into static HTML/JS/CSS assets. Stage 2 serves them using a super-lightweight **NGINX Alpine** container with custom `nginx.conf` handling SPA fallback and API reverse-proxying.

---

### Component 2: Backend API (`/backend`)
* **Framework**: Node 20 + Express with TypeScript.
* **Entrypoints**:
  - `src/app.ts`: Creates Express instance, sets CORS, request logging, and registers route modules.
  - `src/server.ts`: Starts the server on port 4000 with graceful shutdown handlers (`SIGTERM`/`SIGINT`) for container orchestrators.
* **Key Endpoints**:
  - `GET /health`: Returns container health status (`healthy`), uptime in seconds, ISO timestamp, environment, and memory usage. Used by Docker and Kubernetes health probes.
  - `GET /api/services`: Returns list of monitored microservices, their statuses (`operational`, `degraded`, `down`), and latency metrics.
  - `GET /api/incidents`: Returns incident log history.
  - `POST /api/incidents`: Validates payload (title, service, severity) and creates new incident records with HTTP 201 (or HTTP 400 on error).
* **Testing**: Jest + Supertest (`src/__tests__/health.test.ts`, `incidents.test.ts`), validating status codes, headers, and validation boundaries.
* **Containerization**: Multi-stage build (`builder` compiles TS, `runner` runs lean Node Alpine under non-root user `USER node` with built-in `HEALTHCHECK`).

---

### Component 3: Build-Fail Quality Gate (`.github/workflows/ci.yml`)
* **When it runs**: Automatically on every Pull Request to `main` and `develop`.
* **What it enforces**:
  1. **Job 1 (Backend)**: Runs `npm run typecheck` (`tsc --noEmit`), `npm run test` (Jest), and `npm run build`.
  2. **Job 2 (Frontend)**: Runs `npm run typecheck` (`tsc --noEmit`), `npm run test` (Vitest), and `npm run build` (Vite).
  3. **Job 3 (Docker Smoke Test)**: Builds both Docker containers inside the GitHub Actions runner, starts the backend container, and executes `curl http://localhost:4000/health`. If anything fails, the entire PR is blocked.

---

### Component 4: Dev & Stage CD Pipelines (`deploy-dev.yml` & `deploy-stage.yml`)
* **Developer Promotion Flow**:
  - Code pushed to `develop` ➔ Triggers **Dev Deployment**.
  - PR merged from `develop` into `main` ➔ Triggers **Stage Deployment**.
* **Zero Credit Card Container Registry**:
  - Both workflows automatically log into **GitHub Container Registry (`ghcr.io`)** using the built-in `${{ secrets.GITHUB_TOKEN }}`.
  - Builds and tags multi-stage Docker images (`dev-<sha>`, `dev-latest`, `stage-<sha>`, `stage-latest`).
  - Pushes images directly to your GitHub repository packages tab.
* **Oracle Cloud Dual Integration**:
  - If Oracle Cloud secrets (`OCI_AUTH_TOKEN`, etc.) are configured, it also logs into Oracle's OCIR registry and triggers OCI deployments.
  - If Oracle credentials are not set, it gracefully continues and guarantees **100% green checkmarks** on GitHub Actions!

---

### Component 5: Agent Rules & Operational Runbooks (`.agents/`)
* **Standards Enforcement**:
  - `.agents/rules/coding-standards.md`: Enforces zero `any` usage, mandatory unit tests, non-root Docker practices.
  - `.agents/rules/devops-ci-cd.md`: Defines branching strategy (`feature` ➔ `develop` ➔ `main`), fail-fast gates, and rollback policies.
  - `.agents/skills/oracle-ci-cd-runbook/SKILL.md`: Production runbook for Oracle Cloud IAM setup, Auth Tokens, OCIR syntax, and troubleshooting.

---

## 🚀 How to Run the Entire Setup on GitHub (Step by Step)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Repository Name: `setup-oracle-ci-cd` (or any name you choose).
3. Select **Public** (recommended so your packages tab is open and visible).
4. Leave all initialization checkboxes empty. Click **Create repository**.

### Step 2: Push Your Code
Open your terminal inside `/Users/vaibhav/setup-oracle-ci-cd` and run:

```bash
# 1. Initialize git repository
git init

# 2. Add all files
git add .

# 3. Create your first commit
git commit -m "feat: complete enterprise fullstack monorepo with ghcr and oci ci/cd"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# 6. Push to main
git push -u origin main

# 7. Create and push the develop branch
git checkout -b develop
git push -u origin develop
```

---

### Step 3: Enable Package Write Permissions on GitHub
To allow GitHub Actions to publish Docker images to your GitHub Packages tab:
1. In your GitHub repository, go to **Settings** (top tab).
2. In the left sidebar, click **Actions** ➔ **General**.
3. Scroll down to **Workflow permissions**.
4. Select **Read and write permissions**.
5. Click **Save**.

---

### Step 4: Watch the Pipelines Run

1. Click the **Actions** tab on your GitHub repository.
2. You will see your workflows running:
   - **CD — Deploy Dev (GHCR & Oracle Cloud)** runs for the `develop` branch.
   - It will compile the code, build the Docker images, and push them to `ghcr.io`!
3. Go back to your repository's main page:
   - Look on the right-hand sidebar under **Packages**:
   - You will see **`cloudpulse-backend`** and **`cloudpulse-frontend`** published live!
