-- This SQL script fixes missing columns in the trips table
-- Run this in the Supabase SQL Editor

-- Add pdfUrl column if it doesn't exist
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "pdfUrl" TEXT;

-- Add any other missing columns that might be needed
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "maps_iframe" TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "features" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS "itinerary_data" JSONB DEFAULT '[]'::jsonb;

-- Verify table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'trips'
ORDER BY ordinal_position; 