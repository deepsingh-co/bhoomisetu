# ==============================================================================
# BHOOMISETU — MULTI-STAGE ENTERPRISE DOCKERFILE
# Compliant with Government of India, NIC & MeghRaj Cloud Standards
# ==============================================================================

# Stage 1: Build Phase
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package descriptors
COPY package*.json tsconfig.json vite.config.ts ./

# Install npm dependencies
RUN npm ci

# Copy application source & schema
COPY src/ ./src/
COPY server/ ./server/
COPY server.ts index.html metadata.json ./
COPY prisma/ ./prisma/
COPY public/ ./public/

# Compile production bundle and backend server binary
RUN npm run build

# Stage 2: Production Minimal Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-privileged system user for security compliance (CERT-In requirement)
RUN addgroup --system --gid 1001 nicgov && \
    adduser --system --uid 1001 bhulekhapp -G nicgov

# Copy compiled artifacts from builder
COPY --from=builder --chown=bhulekhapp:nicgov /app/dist ./dist
COPY --from=builder --chown=bhulekhapp:nicgov /app/package*.json ./
COPY --from=builder --chown=bhulekhapp:nicgov /app/node_modules ./node_modules
COPY --from=builder --chown=bhulekhapp:nicgov /app/server.ts ./

USER bhulekhapp

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
