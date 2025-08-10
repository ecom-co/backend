-- PostgreSQL Initialization Script for ecom-backend
-- Runs only on first initialization

-- Connect to target DB (created by POSTGRES_DB env)
\c ecom_backend

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
