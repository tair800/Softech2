-- Clear all data from VisitorAnalytics table
-- This will reset all visitor analytics to zero

-- Option 1: Delete all records (recommended for clean start)
DELETE FROM VisitorAnalytics;

-- Option 2: If you want to keep the table structure but reset specific fields
-- UPDATE VisitorAnalytics SET 
--     DurationSeconds = 0,
--     IsUniqueVisitor = 0;

-- Verify the table is empty
SELECT COUNT(*) AS TotalRecords FROM VisitorAnalytics;

-- Show table structure (should be empty now)
SELECT TOP 5 * FROM VisitorAnalytics;

-- Optional: Reset the identity column if you want to start fresh
-- DBCC CHECKIDENT ('VisitorAnalytics', RESEED, 0);

PRINT 'VisitorAnalytics table cleared successfully!';
PRINT 'All visitor data has been reset to zero.';
