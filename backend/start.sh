#!/bin/sh

echo "🔄 Running database migrations..."

for i in 1 2 3 4 5; do
  if bunx prisma migrate deploy; then
    echo "✅ Migrations complete"
    break
  fi
  if [ "$i" = "5" ]; then
    echo "❌ Migrations failed after 5 attempts — check DATABASE_URL"
    exit 1
  fi
  echo "⚠️ Migration attempt $i failed, retrying in 5s..."
  sleep 5
done

echo "🚗 Starting Car Rental API..."
exec bun run src/index.ts
