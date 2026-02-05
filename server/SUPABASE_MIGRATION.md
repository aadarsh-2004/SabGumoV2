# Supabase Migration Guide

This document outlines the steps to migrate the SubGumo backend from SQLite to Supabase.

## Prerequisites

1. Create a Supabase account at https://supabase.com/
2. Create a new Supabase project
3. Make note of your Supabase URL and anon key from the API settings

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the `server` directory with your Supabase credentials:

```
# Supabase credentials
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Email credentials
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2. Create Database Tables

Set up the Supabase database schema by running the SQL commands in `supabase-schema.sql`. You can run these in the Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the contents of `supabase-schema.sql`
5. Click "Run" to execute the SQL commands

### 3. Migrate Existing Data

If you have existing data in SQLite that you want to migrate:

1. Make sure your `.env` file is configured properly
2. Run the migration script:

```bash
node migrate-to-supabase.js
```

### 4. Testing the Supabase Connection

After completing the setup, run the server to test the connection:

```bash
npm start
```

## Frontend Configuration

Update the frontend to use the Supabase backend:

1. Create a `.env` file in the `client` directory with:

```
VITE_API_BASE_URL=http://localhost:3001/api

# If directly accessing Supabase from the client:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Restart the frontend application to apply the changes.

## Troubleshooting

- If you encounter CORS issues, ensure your Supabase project's API settings allow requests from your frontend domain.
- Check the server logs for any connection errors or database-related issues.
- Verify that your `.env` files contain the correct credentials.

## Security Considerations

- The anon key from Supabase is meant for public use, but still should not be exposed unnecessarily.
- Consider setting up Row Level Security (RLS) policies in Supabase for more granular access control.
- For production deployment, use environment variables on your hosting platform rather than .env files. 