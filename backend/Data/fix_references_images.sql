-- Fix References table by replacing blob URLs with placeholder images
UPDATE References 
SET imageUrl = '/uploads/references/placeholder.png'
WHERE imageUrl LIKE 'blob:%';

-- Or if you want to clear them completely:
-- DELETE FROM References;
-- DBCC CHECKIDENT ('References', RESEED, 0);
