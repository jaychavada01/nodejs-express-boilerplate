-- =============================================================================
-- Migration: Create Sample Table
-- Date: 2026-09-30
-- Description: Creates the initial sample table matching SWP model structure
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "sample" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) DEFAULT 'active',
    "is_active" BOOLEAN DEFAULT TRUE,
    "created_at" BIGINT NOT NULL,
    "created_by" UUID DEFAULT NULL,
    "updated_at" BIGINT DEFAULT NULL,
    "updated_by" UUID DEFAULT NULL,
    "deleted_at" BIGINT DEFAULT NULL,
    "deleted_by" UUID DEFAULT NULL,
    "is_deleted" BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_sample_status" ON "sample" ("status");
CREATE INDEX IF NOT EXISTS "idx_sample_is_active" ON "sample" ("is_active");
CREATE INDEX IF NOT EXISTS "idx_sample_is_deleted" ON "sample" ("is_deleted");
CREATE INDEX IF NOT EXISTS "idx_sample_created_at" ON "sample" ("created_at");
