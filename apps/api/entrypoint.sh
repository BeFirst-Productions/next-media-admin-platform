#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."

# Retry loop to ensure DB is accepting connections before running migrations
MAX_RETRIES=30
COUNT=0

until npx prisma migrate deploy --schema=./prisma/schema > /dev/null 2>&1 || [ $COUNT -eq $MAX_RETRIES ]; do
  COUNT=$((COUNT + 1))
  echo "Database not ready yet (attempt $COUNT/$MAX_RETRIES)... sleeping 2s"
  sleep 2
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Database migration failed to connect after $MAX_RETRIES attempts."
  exit 1
fi

echo "✅ Prisma migrations applied successfully."

# Optional: Auto-seed if RUN_SEED=true
if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Seeding database..."
  pnpm prisma:seed || echo "⚠️ Seeding skipped or already applied."
fi

# Execute the main container command (CMD)
exec "$@"
