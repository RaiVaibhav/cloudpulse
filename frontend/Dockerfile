# ---------------------------------------------------------
# Multi-Stage Production Dockerfile for Frontend (Vite + Nginx)
# ---------------------------------------------------------

# Stage 1: Build production bundle
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src

# Typecheck and Bundle
RUN npm run typecheck
RUN npm run build

# ---------------------------------------------------------
# Stage 2: Serve static bundle via NGINX Alpine
# ---------------------------------------------------------
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Clean default static assets
RUN rm -rf ./*

# Copy built bundle from builder
COPY --from=builder /app/dist ./

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
