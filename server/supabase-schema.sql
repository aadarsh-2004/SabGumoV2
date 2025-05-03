-- Supabase uses PostgreSQL, which has different syntax than SQLite
-- This script creates the required tables for the SubGumo application

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  destination TEXT,
  guests INTEGER,
  travelDates TEXT,
  message TEXT,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_completed BOOLEAN DEFAULT FALSE
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  location_name TEXT NOT NULL,
  distance TEXT,
  card_img TEXT,
  info_img TEXT,
  title TEXT NOT NULL,
  card_subtitle TEXT,
  subtitle TEXT,
  original_cost TEXT,
  cost TEXT,
  duration TEXT,
  is_upcoming BOOLEAN DEFAULT FALSE,
  description TEXT,
  rating FLOAT,
  reviews_count INTEGER,
  features JSONB, -- PostgreSQL uses JSONB for JSON data
  start_date DATE,
  total_seats INTEGER,
  booked_seats INTEGER DEFAULT 0,
  badge TEXT,
  maps_iframe TEXT,
  itinerary_data JSONB, -- PostgreSQL uses JSONB for JSON data
  pdfUrl TEXT
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_inquiries_received_at ON inquiries(received_at);
CREATE INDEX IF NOT EXISTS idx_trips_is_upcoming ON trips(is_upcoming);

-- Add any initial seed data below if needed 