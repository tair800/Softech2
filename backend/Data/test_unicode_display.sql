-- Test Unicode display in EquipmentFeatures
-- This will help determine if the issue is in storage or display

-- Test 1: Insert a simple test record with Unicode
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES 
(999, N'Test: ə ı ç ş ğ ü ö ı', 0, GETDATE());

-- Test 2: Query and display the test record
SELECT 
    Id,
    EquipmentId,
    Feature,
    'Length: ' + CAST(LEN(Feature) AS VARCHAR) + ', Unicode Length: ' + CAST(DATALENGTH(Feature) AS VARCHAR) AS LengthInfo
FROM EquipmentFeatures 
WHERE EquipmentId = 999;

-- Test 3: Show some existing features with length info
SELECT TOP 5
    Id,
    EquipmentId,
    Feature,
    'Length: ' + CAST(LEN(Feature) AS VARCHAR) + ', Unicode Length: ' + CAST(DATALENGTH(Feature) AS VARCHAR) AS LengthInfo
FROM EquipmentFeatures 
ORDER BY Id;
