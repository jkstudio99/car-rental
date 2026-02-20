#!/bin/sh

echo "🔄 Running database migrations..."
bunx prisma migrate deploy

echo "🌱 Seeding database..."
bun run prisma/seed.ts

echo "🚗 Starting Car Rental API..."
bun run src/index.ts
