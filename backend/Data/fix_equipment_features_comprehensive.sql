-- Comprehensive Fix for EquipmentFeatures Azerbaijani Characters
-- This script updates all corrupted features with the correct Unicode text

-- First, let's see what we're working with
SELECT 'Current corrupted features:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures WHERE Feature LIKE '%Ã%' OR Feature LIKE '%Ä%' OR Feature LIKE '%É%' OR Feature LIKE '%™%' OR Feature LIKE '%Ÿ%' OR Feature LIKE '%Å%' OR Feature LIKE '%¼%' OR Feature LIKE '%¹%';

-- Now fix all the features systematically
-- Equipment ID 1-3: PosClass TX-1500S features
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 137;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 138;
UPDATE EquipmentFeatures SET Feature = N'Wi-Fi Adapter Artırma İmkanı' WHERE Id = 139;
UPDATE EquipmentFeatures SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı' WHERE Id = 140;

UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 141;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 142;
UPDATE EquipmentFeatures SET Feature = N'Wi-Fi Adapter Artırma İmkanı' WHERE Id = 143;
UPDATE EquipmentFeatures SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı' WHERE Id = 144;

UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Id = 145;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Id = 146;
UPDATE EquipmentFeatures SET Feature = N'Wi-Fi Adapter Artırma İmkanı' WHERE Id = 147;
UPDATE EquipmentFeatures SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı' WHERE Id = 148;

-- Equipment ID 4: Honeywell Voyager 1200g features
UPDATE EquipmentFeatures SET Feature = N'1D/2D Barkod Dəstəyi' WHERE Id = 149;
UPDATE EquipmentFeatures SET Feature = N'Sürətli Oxuma' WHERE Id = 150;
UPDATE EquipmentFeatures SET Feature = N'USB və RS232 Bağlantı' WHERE Id = 151;
UPDATE EquipmentFeatures SET Feature = N'Sərt Dizayn' WHERE Id = 152;

-- Equipment ID 5: Epson TM-T88VI features
UPDATE EquipmentFeatures SET Feature = N'58mm Kağız Genişliyi' WHERE Id = 153;
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 154;
UPDATE EquipmentFeatures SET Feature = N'USB/Ethernet' WHERE Id = 155;
UPDATE EquipmentFeatures SET Feature = N'Yüksək Keyfiyyət' WHERE Id = 156;

-- Equipment ID 6: APG Cash Drawer features
UPDATE EquipmentFeatures SET Feature = N'Sol/Sağ Açılma' WHERE Id = 157;
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsiz Kilid' WHERE Id = 158;
UPDATE EquipmentFeatures SET Feature = N'Açar İdarəetməsi' WHERE Id = 159;
UPDATE EquipmentFeatures SET Feature = N'Universal Uyğunluq' WHERE Id = 160;

-- Equipment ID 7: Verifone VX520 features
UPDATE EquipmentFeatures SET Feature = N'Chip Kart Dəstəyi' WHERE Id = 161;
UPDATE EquipmentFeatures SET Feature = N'Contactless Ödəniş' WHERE Id = 162;
UPDATE EquipmentFeatures SET Feature = N'3G/Wi-Fi' WHERE Id = 163;
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsizlik' WHERE Id = 164;

-- Equipment ID 8: Datalogic Memor X3 features
UPDATE EquipmentFeatures SET Feature = N'Mobil Kompüter' WHERE Id = 165;
UPDATE EquipmentFeatures SET Feature = N'Barkod Skeneri' WHERE Id = 166;
UPDATE EquipmentFeatures SET Feature = N'Windows Embedded' WHERE Id = 167;
UPDATE EquipmentFeatures SET Feature = N'Uzun Batareya' WHERE Id = 168;

-- Equipment ID 9: Star TSP100 features
UPDATE EquipmentFeatures SET Feature = N'80mm Kağız' WHERE Id = 169;
UPDATE EquipmentFeatures SET Feature = N'Kompakt Dizayn' WHERE Id = 170;
UPDATE EquipmentFeatures SET Feature = N'USB/Serial' WHERE Id = 171;
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Id = 172;

-- Equipment ID 10: Zebra ZD220 features
UPDATE EquipmentFeatures SET Feature = N'RFID Dəstəyi' WHERE Id = 173;
UPDATE EquipmentFeatures SET Feature = N'2 inch Etiket' WHERE Id = 174;
UPDATE EquipmentFeatures SET Feature = N'Yüksək Keyfiyyət' WHERE Id = 175;
UPDATE EquipmentFeatures SET Feature = N'Professional' WHERE Id = 176;

-- Verify the fix
SELECT 'After fix - all features should be correct:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures ORDER BY EquipmentId, OrderIndex;

-- Check if any corrupted characters remain
SELECT 'Checking for any remaining corrupted characters:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures 
WHERE Feature LIKE '%Ã%' OR Feature LIKE '%Ä%' OR Feature LIKE '%É%' OR Feature LIKE '%™%' OR Feature LIKE '%Ÿ%' OR Feature LIKE '%Å%' OR Feature LIKE '%¼%' OR Feature LIKE '%¹%';
