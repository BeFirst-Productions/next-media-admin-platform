# -------------------------------------------------------------------
# Stage 1: Dependencies
# -------------------------------------------------------------------
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Install OpenSSL for Prisma and curl for healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm via Corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy workspace package manifests & lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/api/package.json ./apps/api/

# Install dependencies across workspaces using pnpm
RUN pnpm install --frozen-lockfile

# -------------------------------------------------------------------
# Stage 2: Build & Prisma Generate
# -------------------------------------------------------------------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=deps /app/tsconfig.base.json ./
COPY --from=deps /app/packages/shared-types ./packages/shared-types
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

COPY apps/api ./apps/api

# Generate Prisma Client & Build TypeScript
WORKDIR /app/apps/api
RUN pnpm prisma:generate
RUN pnpm build

# -------------------------------------------------------------------
# Stage 3: Production Runner
# -------------------------------------------------------------------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# Security & environment
ENV NODE_ENV=production
ENV PORT=4000
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Copy production dependencies & built artifacts
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=node:node /app/packages/shared-types ./packages/shared-types

COPY --from=builder --chown=node:node /app/apps/api/package*.json ./apps/api/
COPY --from=builder --chown=node:node /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=node:node /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder --chown=node:node /app/apps/api/prisma.config.ts ./apps/api/
COPY --chown=node:node apps/api/entrypoint.sh /app/apps/api/entrypoint.sh

RUN chmod +x /app/apps/api/entrypoint.sh

# Run as non-root user
USER node

WORKDIR /app/apps/api

EXPOSE 4000

# Built-in health check matching the Express /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

ENTRYPOINT ["/app/apps/api/entrypoint.sh"]
CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]
