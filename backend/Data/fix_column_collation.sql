-- Fix the Feature column collation specifically to support Unicode
-- This is safer than changing the entire database collation

-- First, let's see the current column definition
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLLATION_NAME,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'EquipmentFeatures' AND COLUMN_NAME = 'Feature';

-- Change the column collation to a Unicode-aware one
ALTER TABLE EquipmentFeatures 
ALTER COLUMN Feature NVARCHAR(200) COLLATE SQL_Latin1_General_CP100_CI_AS;

-- Verify the change
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLLATION_NAME,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'EquipmentFeatures' AND COLUMN_NAME = 'Feature';

-- Now let's test inserting a simple Unicode record
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES 
(999, N'Test: ə ı ç ş ğ ü ö ı', 0, GETDATE());

-- Check if it worked
SELECT 
    Id,
    EquipmentId,
    Feature,
    'Length: ' + CAST(LEN(Feature) AS VARCHAR) + ', Unicode Length: ' + CAST(DATALENGTH(Feature) AS VARCHAR) AS LengthInfo
FROM EquipmentFeatures 
WHERE EquipmentId = 999;
