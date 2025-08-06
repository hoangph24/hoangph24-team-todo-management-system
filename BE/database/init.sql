-- Database initialization script
-- This script runs when the PostgreSQL container starts

-- Create database if not exists
SELECT 'CREATE DATABASE todo_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'todo_app')\gexec

-- Connect to the database
\c todo_app;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 