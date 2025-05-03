-- Fix missing column in inquiries table
-- Run this script in your Supabase SQL Editor

-- Check if column exists first to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'inquiries' 
        AND column_name = 'travel_dates'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE inquiries ADD COLUMN travel_dates TEXT;
        RAISE NOTICE 'Column travel_dates added to inquiries table';
    ELSE
        RAISE NOTICE 'Column travel_dates already exists in inquiries table';
    END IF;
END
$$;

-- Rename existing travelDates column to travel_dates if it exists
-- (This is needed only if the column exists but with a different case)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'inquiries' 
        AND column_name = 'travelDates'
    ) THEN
        ALTER TABLE inquiries RENAME COLUMN "travelDates" TO travel_dates;
        RAISE NOTICE 'Column travelDates renamed to travel_dates';
    END IF;
END
$$; 