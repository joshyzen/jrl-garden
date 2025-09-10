-- Add price and unit columns to Plant table
-- Run this in Supabase SQL Editor

ALTER TABLE "Plant" 
ADD COLUMN "price" DOUBLE PRECISION,
ADD COLUMN "unit" TEXT;

-- Add some sample pricing data for existing plants
UPDATE "Plant" SET 
  "price" = CASE 
    WHEN "category" = 'Tree' THEN 45.00
    WHEN "category" = 'Shrub' THEN 25.00
    WHEN "category" = 'Perennial' THEN 12.00
    WHEN "category" = 'Annual' THEN 8.00
    WHEN "category" = 'Grass' THEN 15.00
    ELSE 10.00
  END,
  "unit" = CASE 
    WHEN "category" = 'Tree' THEN 'each'
    WHEN "category" = 'Shrub' THEN 'each'
    WHEN "category" = 'Perennial' THEN 'each'
    WHEN "category" = 'Annual' THEN 'flat'
    WHEN "category" = 'Grass' THEN 'each'
    ELSE 'each'
  END
WHERE "price" IS NULL;
