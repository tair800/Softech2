-- Fix EquipmentFeatures.Feature column collation to Unicode-aware collation
-- This should resolve the Azerbaijani character corruption issue

-- First, check current collation
SELECT 'Current collation:' AS Status;
SELECT COLUMN_NAME, DATA_TYPE, COLLATION_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'EquipmentFeatures' AND COLUMN_NAME = 'Feature';

-- Change the column collation to a Unicode-aware collation
-- Using Latin1_General_100_CI_AS_SC (Unicode-aware version)
ALTER TABLE EquipmentFeatures 
ALTER COLUMN Feature NVARCHAR(200) COLLATE Latin1_General_100_CI_AS_SC;

-- Verify the change
SELECT 'After collation change:' AS Status;
SELECT COLUMN_NAME, DATA_TYPE, COLLATION_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'EquipmentFeatures' AND COLUMN_NAME = 'Feature';

-- Now let's test if we can insert proper Unicode text
SELECT 'Testing Unicode insertion:' AS Status;
UPDATE EquipmentFeatures 
SET Feature = N'Türkiyə İstehsalı Keyfiyyət' 
WHERE Id = 137;

-- Check if the fix worked
SELECT 'Verifying the fix:' AS Status;
SELECT Id, EquipmentId, Feature, LEN(Feature) as CharCount, DATALENGTH(Feature) as ByteLength 
FROM EquipmentFeatures 
WHERE Id = 137;

-- Show all features to verify they're now correct
SELECT 'All features after fix:' AS Status;
SELECT Id, EquipmentId, Feature 
FROM EquipmentFeatures 
ORDER BY EquipmentId, OrderIndex;
