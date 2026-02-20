#!/bin/sh

echo "🔄 Running database migrations..."
bunx prisma migrate deploy || echo "⚠️ Migrations failed, continuing..."

echo "🚗 Starting Car Rental API..."
exec bun run src/index.ts
