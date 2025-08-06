#!/bin/sh

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
done
echo "✅ Database is ready!"

# Run database migrations and seed data
echo "🌱 Running database setup..."
npm run seed

# Start the application
echo "🚀 Starting application..."
exec npm run start:dev 