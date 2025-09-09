-- Drop extra level
ALTER TABLE public."ServiceItem" DROP COLUMN IF EXISTS "subcategory";
