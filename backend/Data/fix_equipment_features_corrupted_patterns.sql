-- Fix EquipmentFeatures using the exact corrupted patterns that exist in the data
-- This approach worked for the Equipment table before

-- First, let's see the current corrupted state
SELECT 'Current corrupted features:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures WHERE Id IN (137, 138, 139, 140);

-- Fix using the exact corrupted patterns I can see
-- Equipment ID 1: PosClass TX-1500S features
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Feature LIKE '%TA¼rkiyÉT%';
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Feature LIKE '%Ä°l RÉTsmi ZÉTmanÉTt%';
UPDATE EquipmentFeatures SET Feature = N'Wi-Fi Adapter Artırma İmkanı' WHERE Feature LIKE '%ArtÄ±rma Ä°mkanÄ±%';
UPDATE EquipmentFeatures SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı' WHERE Feature LIKE '%Arxa Ekran Æ?lavÉT Ä°mkanÄ±%';

-- Equipment ID 2: PosClass TX-1500S features (duplicate)
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Feature LIKE '%TA¼rkiyÉT%' AND EquipmentId = 2;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Feature LIKE '%Ä°l RÉTsmi ZÉTmanÉTt%' AND EquipmentId = 2;
UPDATE EquipmentFeatures SET Feature = N'Wi-Fi Adapter Artırma İmkanı' WHERE Feature LIKE '%ArtÄ±rma Ä°mkanÄ±%' AND EquipmentId = 2;
UPDATE EquipmentFeatures SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı' WHERE Feature LIKE '%Arxa Ekran Æ?lavÉT Ä°mkanÄ±%' AND EquipmentId = 2;

-- Equipment ID 3: PosClass TX-1500S features (duplicate)
UPDATE EquipmentFeatures SET Feature = N'Türkiyə İstehsalı Keyfiyyət' WHERE Feature LIKE '%TA¼rkiyÉT%' AND EquipmentId = 3;
UPDATE EquipmentFeatures SET Feature = N'1 İl Rəsmi Zəmanət' WHERE Feature LIKE '%Ä°l RÉTsmi ZÉTmanÉTt%' AND EquipmentId = 3;
UPDATE EquipmentFeatures SET Feature = N'Wi-Fi Adapter Artırma İmkanı' WHERE Feature LIKE '%ArtÄ±rma Ä°mkanÄ±%' AND EquipmentId = 3;
UPDATE EquipmentFeatures SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı' WHERE Feature LIKE '%Arxa Ekran Æ?lavÉT Ä°mkanÄ±%' AND EquipmentId = 3;

-- Equipment ID 4: Honeywell Voyager 1200g features
UPDATE EquipmentFeatures SET Feature = N'1D/2D Barkod Dəstəyi' WHERE Feature LIKE '%Barkod DÉTstÉTyi%';
UPDATE EquipmentFeatures SET Feature = N'Sürətli Oxuma' WHERE Feature LIKE '%SA¼rÉTtli Oxuma%';
UPDATE EquipmentFeatures SET Feature = N'USB və RS232 Bağlantı' WHERE Feature LIKE '%USB vÉT RS232 BaÄYlantÄ±%';
UPDATE EquipmentFeatures SET Feature = N'Sərt Dizayn' WHERE Feature LIKE '%SÉTrt Dizayn%';

-- Equipment ID 5: Epson TM-T88VI features
UPDATE EquipmentFeatures SET Feature = N'58mm Kağız Genişliyi' WHERE Feature LIKE '%KaÄYÄ±z GeniÅYliyi%';
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Feature LIKE '%SA¼rÉTtli A╪ap%';
UPDATE EquipmentFeatures SET Feature = N'USB/Ethernet' WHERE Feature LIKE '%USB/Ethernet%';
UPDATE EquipmentFeatures SET Feature = N'Yüksək Keyfiyyət' WHERE Feature LIKE '%YA¼ksÉTk KeyfiyyÉTt%';

-- Equipment ID 6: APG Cash Drawer features
UPDATE EquipmentFeatures SET Feature = N'Sol/Sağ Açılma' WHERE Feature LIKE '%Sol/SaÄY AA§Ä±lma%';
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsiz Kilid' WHERE Feature LIKE '%TÉThlA¼kÉTsiz Kilid%';
UPDATE EquipmentFeatures SET Feature = N'Açar İdarəetməsi' WHERE Feature LIKE '%AA§ar Ä°darÉTetmÉTsi%';
UPDATE EquipmentFeatures SET Feature = N'Universal Uyğunluq' WHERE Feature LIKE '%Universal UyÄYunluq%';

-- Equipment ID 7: Verifone VX520 features
UPDATE EquipmentFeatures SET Feature = N'Chip Kart Dəstəyi' WHERE Feature LIKE '%Kart DÉTstÉTyi%';
UPDATE EquipmentFeatures SET Feature = N'Contactless Ödəniş' WHERE Feature LIKE '%Contactless A-dÉTniÅY%';
UPDATE EquipmentFeatures SET Feature = N'3G/Wi-Fi' WHERE Feature LIKE '%3G/Wi-Fi%';
UPDATE EquipmentFeatures SET Feature = N'Təhlükəsizlik' WHERE Feature LIKE '%TÉThlA¼kÉTsizlik%';

-- Equipment ID 8: Datalogic Memor X3 features
UPDATE EquipmentFeatures SET Feature = N'Mobil Kompüter' WHERE Feature LIKE '%Mobil KompA¼ter%';
UPDATE EquipmentFeatures SET Feature = N'Barkod Skeneri' WHERE Feature LIKE '%Barkod Skeneri%';
UPDATE EquipmentFeatures SET Feature = N'Windows Embedded' WHERE Feature LIKE '%Windows Embedded%';
UPDATE EquipmentFeatures SET Feature = N'Uzun Batareya' WHERE Feature LIKE '%Uzun Batareya%';

-- Equipment ID 9: Star TSP100 features
UPDATE EquipmentFeatures SET Feature = N'80mm Kağız' WHERE Feature LIKE '%KaÄYÄ±z%';
UPDATE EquipmentFeatures SET Feature = N'Kompakt Dizayn' WHERE Feature LIKE '%Kompakt Dizayn%';
UPDATE EquipmentFeatures SET Feature = N'USB/Serial' WHERE Feature LIKE '%USB/Serial%';
UPDATE EquipmentFeatures SET Feature = N'Sürətli Çap' WHERE Feature LIKE '%SA¼rÉTtli A╪ap%';

-- Equipment ID 10: Zebra ZD220 features
UPDATE EquipmentFeatures SET Feature = N'RFID Dəstəyi' WHERE Feature LIKE '%RFID DÉTstÉTyi%';
UPDATE EquipmentFeatures SET Feature = N'2 inch Etiket' WHERE Feature LIKE '%2 inch Etiket%';
UPDATE EquipmentFeatures SET Feature = N'Yüksək Keyfiyyət' WHERE Feature LIKE '%YA¼ksÉTk KeyfiyyÉTt%';
UPDATE EquipmentFeatures SET Feature = N'Professional' WHERE Feature LIKE '%Professional%';

-- Verify the fix
SELECT 'After fix - all features should be correct:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures ORDER BY EquipmentId, OrderIndex;

-- Check if any corrupted characters remain
SELECT 'Checking for any remaining corrupted characters:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures 
WHERE Feature LIKE '%Ã%' OR Feature LIKE '%Ä%' OR Feature LIKE '%É%' OR Feature LIKE '%™%' OR Feature LIKE '%Ÿ%' OR Feature LIKE '%Å%' OR Feature LIKE '%¼%' OR Feature LIKE '%¹%';
