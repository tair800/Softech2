-- Fix Azerbaijani Character Encoding in EquipmentFeatures Table - Version 3
-- This script uses direct ID-based updates for the most corrupted entries

-- Fix Türkiyə İstehsalı Keyfiyyət entries
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 14;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 18;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 22;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 33;
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 52;

-- Fix 1 İl Rəsmi Zəmanət entries
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 15;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 19;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 23;

-- Fix Sürətli Çap entries
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 27;
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 31;
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 49;

-- Fix 80mm Kağız entries
UPDATE EquipmentFeatures SET Feature = N'80mm Kağız' WHERE Id = 30;
UPDATE EquipmentFeatures SET Feature = N'80mm Kağız' WHERE Id = 46;

-- Fix Sol/Sağ Açılma
UPDATE EquipmentFeatures SET Feature = N'Sol/Sağ Açılma' WHERE Id = 34;

-- Fix Təhlükəsiz Kilid entries
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsiz Kilid' WHERE Id = 35;
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsiz Kilid' WHERE Id = 41;

-- Fix Açar İdarəetməsi
UPDATE EquipmentFeatures SET Feature = N'Açar İdarəetməsi' WHERE Id = 36;

-- Fix Contactless Ödəniş
UPDATE EquipmentFeatures SET Feature = N'Contactless Ödəniş' WHERE Id = 39;

-- Fix Mobil Kompüter
UPDATE EquipmentFeatures SET Feature = N'Mobil Kompüter' WHERE Id = 42;

-- Fix Kompakt Dizayn entries
UPDATE EquipmentFeatures SET Feature = N'Kompakt Dizayn' WHERE Id = 29;
UPDATE EquipmentFeatures SET Feature = N'Kompakt Dizayn' WHERE Id = 47;

-- Fix Windows Embedded
UPDATE EquipmentFeatures SET Feature = N'Windows Embedded' WHERE Id = 44;

-- Show results
SELECT 'Updated ' + CAST(@@ROWCOUNT AS VARCHAR) + ' rows' AS Result;
