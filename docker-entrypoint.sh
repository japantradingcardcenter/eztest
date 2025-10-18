#!/bin/sh
set -e

echo "Starting EzTest application..."

# Wait for database to be ready
echo "Waiting for database connection..."
until npx prisma db push --skip-generate 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
npx prisma db push --skip-generate

echo "Database migrations completed!"

# Execute the main command
exec "$@"
