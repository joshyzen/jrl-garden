-- Alter Plant table to support advanced management
-- Run once in Supabase SQL editor

alter table "public"."Plant"
  add column if not exists "scientificName" text,
  alter column "imageUrl" drop not null,
  add column if not exists "updatedAt" timestamp with time zone default now();

-- Ensure updatedAt auto-updates
create or replace function public.set_current_timestamp_updatedat()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_public_Plant_updatedAt on public."Plant";
create trigger set_public_Plant_updatedAt
before update on public."Plant"
for each row
execute function public.set_current_timestamp_updatedat();

