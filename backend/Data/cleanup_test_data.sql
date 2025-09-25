-- Clean up test data
DELETE FROM EquipmentFeatures WHERE EquipmentId = 999;

SELECT 'Test data cleaned up. Total features: ' + CAST(COUNT(*) AS VARCHAR) AS Result
FROM EquipmentFeatures;
