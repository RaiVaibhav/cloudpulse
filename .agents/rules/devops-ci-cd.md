---
description: CI/CD, Branching, and Oracle Cloud Deployment Rules
globs: [".github/workflows/*.yml", ".oci/*", "Dockerfile*"]
---

# DevOps CI/CD and Oracle Cloud Deployment Standards

## 1. Branching Strategy & Lifecycle Promotion
- `feature/*` / `bugfix/*`: Branch off `develop`. Tested via PR gate CI workflow (`ci.yml`).
- `develop`: Development branch. Merges automatically trigger `deploy-dev.yml` to the OCI Dev environment.
- `main`: Release / Staging branch. Merges trigger `deploy-stage.yml` to the OCI Staging environment.
- Production: Released via semantic git tags (`vX.Y.Z`) from `main`.

## 2. CI/CD Fail-Fast Pipeline Verification
- Every CI workflow run must sequentially or conditionally execute:
  1. Static analysis & typecheck (`tsc --noEmit`).
  2. Automated test suites (`npm run test`).
  3. Docker build verification (ensuring container images compile without cached layer breakage).
- Failures in any upstream job abort downstream deployment immediately.

## 3. Oracle Cloud Infrastructure (OCI) Deployment Rules
- Registry: All images must be tagged with commit SHA and environment tags, pushed to Oracle Cloud Infrastructure Registry (OCIR):
  `<region-key>.ocir.io/<tenancy-namespace>/<repo-name>:<tag>`.
- Authentication: Securely use OCI Auth Tokens or Instance Principals. Never commit OCI private keys or API signing keys into Git.
- Deployment Targets: Deploy to OCI Container Engine for Kubernetes (OKE) or OCI Container Instances.
- Health Probes: After deployment rollout, automated curl/http checks against `/health` must confirm 200 OK within 60 seconds; failure triggers immediate rollback.
