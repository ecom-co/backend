## ---------- Base ----------
FROM node:24-alpine AS base
WORKDIR /app

## ---------- Development ----------
FROM base AS dev
ENV NODE_ENV=development \
    SKIP_HUSKY=1
COPY package.json package-lock.json* ./
RUN npm ci --omit=optional
COPY . .
# Default dev/debug ports (actual port comes from env)
EXPOSE 3012 9229
CMD ["npm", "run", "start:dev"]

## ---------- Builder ----------
FROM base AS builder
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm ci --omit=optional
COPY . .
RUN npm run build

## ---------- Production ----------
FROM node:24-alpine AS production
ENV NODE_ENV=production \
    SKIP_HUSKY=1
WORKDIR /app

# Install only production deps (tsconfig-paths is needed at runtime by start:prod)
COPY package.json package-lock.json* ./
RUN npm ci --omit=optional --only=production \
 && npm i --no-save tsconfig-paths@^4.2.0

# Copy built app
COPY --from=builder /app/dist ./dist

# Drop privileges
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs \
 && chown -R nestjs:nodejs /app
USER nestjs

# Default prod port (actual port comes from env)
EXPOSE 3012
CMD ["npm", "run", "start:prod"]


