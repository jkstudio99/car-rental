FROM oven/bun:1.2-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bunx prisma generate

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

# Start script that runs migrations then starts server
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x start.sh

CMD ["./start.sh"]
