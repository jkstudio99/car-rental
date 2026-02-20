#!/bin/sh

echo "🔄 Running database migrations..."
bunx prisma migrate deploy || echo "⚠️ Migrations failed, continuing..."

echo "🌱 Seeding database..."
bunx prisma migrate exec --file prisma/seed.ts || echo "⚠️ Seed failed, continuing..."

echo "🚗 Starting Car Rental API..."
bun run src/index.ts
