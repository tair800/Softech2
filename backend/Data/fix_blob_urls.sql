-- Fix Equipment blob URLs to proper file paths
-- Run this script in SQL Server Management Studio or any SQL client

USE [WebOnlyAPI]
GO

-- First, check current image URLs to see the blob URLs
PRINT 'Current image URLs (including blob URLs):'
SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id
GO

-- Fix blob URLs by replacing them with proper file paths
-- Equipment 1-3: use equipment1.png
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment1.png' 
WHERE Id IN (1, 2, 3) AND (ImageUrl LIKE 'blob:%' OR ImageUrl IS NULL)
GO

-- Equipment 4-10: use equipment2.png
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment2.png' 
WHERE Id IN (4, 5, 6, 7, 8, 9, 10) AND (ImageUrl LIKE 'blob:%' OR ImageUrl IS NULL)
GO

-- Generic fix for any remaining blob URLs
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment1.png' 
WHERE ImageUrl LIKE 'blob:%'
GO

-- Set default image for any equipment without images
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment1.png' 
WHERE ImageUrl IS NULL OR ImageUrl = ''
GO

-- Verify the fix
PRINT 'After fixing blob URLs:'
SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id
GO

-- Check if any blob URLs remain
PRINT 'Remaining blob URLs (should be 0):'
SELECT COUNT(*) AS BlobUrlCount FROM Equipment WHERE ImageUrl LIKE 'blob:%'
GO

-- Check equipment without images
PRINT 'Equipment without images (should be 0):'
SELECT COUNT(*) AS NullCount FROM Equipment WHERE ImageUrl IS NULL OR ImageUrl = ''
GO

PRINT 'Blob URL fix completed successfully!'
