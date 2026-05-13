-- Supabase SQL Schema for Sick Leave Report System
-- Run this in Supabase SQL Editor to create the reports table

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY,
  leave_id TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  national_id TEXT NOT NULL,
  nationality_en TEXT NOT NULL,
  nationality_ar TEXT NOT NULL,
  employer_en TEXT NOT NULL,
  employer_ar TEXT NOT NULL,
  admission_date TEXT NOT NULL,
  discharge_date TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  admission_date_hijri TEXT NOT NULL,
  discharge_date_hijri TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  practitioner_name_en TEXT NOT NULL,
  practitioner_name_ar TEXT NOT NULL,
  position_en TEXT NOT NULL,
  position_ar TEXT NOT NULL,
  hospital_name_en TEXT NOT NULL,
  hospital_name_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since we use service role key on server)
CREATE POLICY "Allow all" ON reports FOR ALL USING (true);
