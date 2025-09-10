-- Add labor column to Estimate table in Supabase
-- Run this in the Supabase SQL editor (execute once)

alter table "public"."Estimate"
  add column if not exists "labor" double precision not null default 0;

-- Optional: backfill or adjustments can go here

