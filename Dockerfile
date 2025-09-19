# Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Force devDependencies to be installed
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm install --include=dev


# Copy app and build
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the project
RUN npm run build

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=development


# Copy only what’s needed
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/db ./db
COPY --from=builder /app/start.sh ./start.sh

# Fix permissions
RUN chown -R node:node /app && chmod +x /app/start.sh

USER node

CMD ["./start.sh"]
