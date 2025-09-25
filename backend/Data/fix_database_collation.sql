-- Fix database collation to support Unicode characters properly
-- This will allow proper storage of Azerbaijani characters

-- First, set the database to single-user mode to change collation
ALTER DATABASE WebOnlyAPI SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

-- Change the database collation to a Unicode-aware collation
ALTER DATABASE WebOnlyAPI COLLATE SQL_Latin1_General_CP100_CI_AS;

-- Set the database back to multi-user mode
ALTER DATABASE WebOnlyAPI SET MULTI_USER;

-- Verify the change
SELECT 
    name AS DatabaseName,
    collation_name AS Collation,
    DATABASEPROPERTYEX(name, 'Collation') AS CurrentCollation
FROM sys.databases 
WHERE name = 'WebOnlyAPI';

-- Now update the corrupted features with proper Unicode
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 14;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 18;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 22;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 33;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 52;

UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 15;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 19;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 23;

UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 27;
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 31;
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 49;

UPDATE EquipmentFeatures SET Feature = N'80mm Kağız' WHERE Id = 30;
UPDATE EquipmentFeatures SET Feature = N'80mm Kağız' WHERE Id = 46;

UPDATE EquipmentFeatures SET Feature = N'Sol/Sağ Açılma' WHERE Id = 34;
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsiz Kilid' WHERE Id = 35;
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsiz Kilid' WHERE Id = 41;
UPDATE EquipmentFeatures SET Feature = N'Açar İdarəetməsi' WHERE Id = 36;
UPDATE EquipmentFeatures SET Feature = N'Contactless Ödəniş' WHERE Id = 39;
UPDATE EquipmentFeatures SET Feature = N'Mobil Kompüter' WHERE Id = 42;
UPDATE EquipmentFeatures SET Feature = N'Kompakt Dizayn' WHERE Id = 29;
UPDATE EquipmentFeatures SET Feature = N'Kompakt Dizayn' WHERE Id = 47;
UPDATE EquipmentFeatures SET Feature = N'Windows Embedded' WHERE Id = 44;

SELECT 'Database collation updated and features fixed. Updated ' + CAST(@@ROWCOUNT AS VARCHAR) + ' rows' AS Result;
