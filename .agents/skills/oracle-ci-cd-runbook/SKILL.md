---
name: oracle-ci-cd-runbook
description: Standard operational procedures and troubleshooting runbook for Oracle Cloud (OCI) CI/CD pipelines, OCIR registry pushes, and Dev/Stage environment deployments.
---

# Oracle Cloud (OCI) CI/CD Operational Runbook

This skill outlines the step-by-step procedures to configure, operate, and troubleshoot automated CI/CD pipelines targeting Oracle Cloud Infrastructure (OCI).

## 1. Prerequisites & OCI IAM Setup

1. **OCI Compartment**: Ensure dedicated compartments are provisioned for `dev` and `stage`.
2. **OCI User / Service Principal**:
   - Create a dedicated CI/CD user (e.g. `github-actions-service-account`).
   - Add user to `devops-ci-cd-group`.
3. **IAM Policy Requirements**:
   ```sql
   Allow group devops-ci-cd-group to manage repos in compartment DevCompartment
   Allow group devops-ci-cd-group to manage repos in compartment StageCompartment
   Allow group devops-ci-cd-group to manage instance-family in compartment DevCompartment
   Allow group devops-ci-cd-group to manage instance-family in compartment StageCompartment
   Allow group devops-ci-cd-group to manage cluster-family in tenancy
   ```
4. **OCI Auth Token**:
   - In OCI Console -> User Profile -> Auth Tokens -> Generate Token.
   - Store this token securely as a GitHub secret: `OCI_AUTH_TOKEN`.

## 2. OCIR (Oracle Cloud Infrastructure Registry) Configuration

- Registry URL format: `<region-key>.ocir.io` (e.g., `iad.ocir.io` for US East Ashburn).
- Docker Login syntax:
  ```bash
  docker login <region-key>.ocir.io -u '<tenancy-namespace>/<username>' -p '<auth-token>'
  ```

## 3. GitHub Secrets Inventory

Configure the following secrets in GitHub Repository Settings -> Secrets and variables -> Actions:

| Secret Name | Description | Example |
|---|---|---|
| `OCI_TENANCY_OCID` | Tenancy OCID | `ocid1.tenancy.oc1..aaaa...` |
| `OCI_USER_OCID` | User OCID | `ocid1.user.oc1..aaaa...` |
| `OCI_FINGERPRINT` | API Key Fingerprint | `20:3b:97:13:58:...` |
| `OCI_KEY_FILE` | Base64-encoded private key | `-----BEGIN RSA PRIVATE KEY-----...` |
| `OCI_REGION` | Target OCI Region identifier | `us-ashburn-1` |
| `OCI_TENANCY_NAMESPACE`| Tenancy Object Storage Namespace | `id1234example` |
| `OCI_REGISTRY_USER` | OCIR Username | `<tenancy-namespace>/ci-user` |
| `OCI_AUTH_TOKEN` | Generated Auth Token | `Abc$1234...` |
| `OCI_DEV_CLUSTER_ID` | OKE Dev Cluster OCID (if using K8s) | `ocid1.cluster.oc1..` |
| `OCI_STAGE_CLUSTER_ID`| OKE Stage Cluster OCID | `ocid1.cluster.oc1..` |

## 4. Pipeline Execution Lifecycle

1. **Pull Request Gate (`ci.yml`)**:
   - Triggers on PR against `develop` or `main`.
   - Executes typecheck, tests, and smoke container builds.
   - Strict gate: merges blocked if any check fails.
2. **Dev Deployment (`deploy-dev.yml`)**:
   - Triggers on push to `develop`.
   - Tags images with `dev-${GITHUB_SHA}` and `dev-latest`.
   - Deploys to OCI Dev environment.
3. **Stage Deployment (`deploy-stage.yml`)**:
   - Triggers on push to `main`.
   - Tags images with `stage-${GITHUB_SHA}` and `stage-latest`.
   - Deploys to OCI Stage environment and performs automated health probe verification.

## 5. Troubleshooting Runbook

- **Docker login failed 401 Unauthorized**:
  - Verify that username includes tenancy namespace: `<tenancy-namespace>/<username>`.
  - For federated identity domains (IAM Identity Domains): `<tenancy-namespace>/oracleidentitycloudservice/<username>`.
- **Healthcheck Probe Fails on Deployment**:
  - Verify security list / network security group (NSG) allows ingress on HTTP/HTTPS ports.
  - Review backend container logs: `kubectl logs -l app=cloudpulse-backend -n stage`.
