---
description: Coding and Engineering Standards for CloudPulse Monorepo
globs: ["**/*.ts", "**/*.tsx", "**/Dockerfile*", "docker-compose*.yml"]
---

# Engineering & Quality Standards

## 1. Strict TypeScript Compliance
- All functions, variables, and API contracts must have explicit TypeScript typing.
- `any` is strictly prohibited unless interacting with legacy untyped third-party libraries.
- Run `npm run typecheck` (`tsc --noEmit`) before any commit or merge. Any compiler error is considered a critical pipeline blocker.

## 2. Testing & Coverage
- Unit tests must be maintained alongside source files (`__tests__/*.test.ts`).
- Backend route additions require integration tests using `supertest` covering both happy paths (200/201) and error validation (400/404/500).
- Frontend components must have Vitest tests verifying core rendering and user interactions.
- All tests must pass with 0 failures: `npm run test`.

## 3. Docker & Container Security
- Production containers must use multi-stage builds (`builder` -> `runner`).
- Container runtimes must run as non-root user (e.g. `USER node`).
- Never bake secret keys or sensitive credentials into Docker images.
- Every service container must implement a `HEALTHCHECK` directive probing `/health` or HTTP root.

## 4. Build-Fail Policy
- If any stage in CI fails (typecheck, lint, test, docker build), the pipeline must terminate immediately with exit code 1.
- No merge to `develop` or `main` is permitted with broken builds.
