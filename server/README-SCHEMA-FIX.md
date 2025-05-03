# Database Schema Fix for Inquiries Table

This document explains how to fix the issue with the inquiries table in the Supabase database.

## Issue

The error message `Failed to save inquiry: Could not find the 'travelDates' column of 'inquiries' in the schema cache` occurs because there is a mismatch between the column names in the Supabase database and what the application code is trying to use.

## Solution

### Option 1: Run the SQL Script

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of the `fix-inquiries-schema.sql` file 
4. Run the script
5. The script will:
   - Add a `travel_dates` column if it doesn't exist
   - Rename the `travelDates` column to `travel_dates` if it exists (to match PostgreSQL conventions)

### Option 2: Manual Fix

If you prefer to fix it manually:

1. Log in to your Supabase dashboard
2. Go to the Table Editor
3. Select the `inquiries` table
4. Add a new column named `travel_dates` with type TEXT
5. Restart your server

## Code Update

The server code has been updated to:

1. Use `travel_dates` (snake_case) instead of `travelDates` (camelCase) when inserting records into the database
2. Keep accepting `travelDates` from frontend form submissions for backward compatibility

## Note on PostgreSQL Naming Conventions

PostgreSQL convention is to use snake_case for column names, while JavaScript typically uses camelCase. The updated code handles this difference by:

- Accepting camelCase property names in the request body (from frontend)
- Converting to snake_case when inserting into the database
- This approach provides the most compatibility without requiring changes to the frontend code 