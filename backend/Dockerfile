# ---------------------------------------------------------
# Multi-Stage Production Dockerfile for Backend API
# ---------------------------------------------------------

# Stage 1: Build & Compile TypeScript
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install openssl for Prisma schema validation
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install all dependencies (including devDependencies for build & typecheck)
RUN npm install

# Copy source code and TypeScript config
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Typecheck and Build to JavaScript
# We provide a dummy DATABASE_URL here because Prisma requires it to exist for schema validation during 'prisma generate'
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npm run typecheck
RUN npm run build

# Prune dev dependencies for lean production footprint
RUN npm prune --production

# ---------------------------------------------------------
# Stage 2: Minimal Production Runtime
# ---------------------------------------------------------
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Install curl and openssl for container health check probes and Prisma
RUN apt-get update && apt-get install -y curl openssl && rm -rf /var/lib/apt/lists/*

# Security: Non-root user
USER node

# Copy production artifacts from builder
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 4000

# OCI / Docker Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/server.js"]
