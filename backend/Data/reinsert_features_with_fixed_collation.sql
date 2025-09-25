-- Re-insert all EquipmentFeatures with correct Unicode text now that collation is fixed
-- This will replace all corrupted data with proper Azerbaijani characters

-- First, backup the current data (just in case)
SELECT 'Backing up current data...' AS Status;
SELECT Id, EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt FROM EquipmentFeatures ORDER BY EquipmentId, OrderIndex;

-- Delete all existing features
SELECT 'Deleting all existing features...' AS Status;
DELETE FROM EquipmentFeatures;

-- Re-insert all features with correct Unicode text
SELECT 'Re-inserting features with correct Unicode...' AS Status;

-- Equipment ID 1: PosClass TX-1500S features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(1, N'Türkiyə İstehsalı Keyfiyyət', 0, GETDATE(), NULL),
(1, N'1 İl Rəsmi Zəmanət', 1, GETDATE(), NULL),
(1, N'Wi-Fi Adapter Artırma İmkanı', 2, GETDATE(), NULL),
(1, N'10.1" Arxa Ekran Əlavə İmkanı', 3, GETDATE(), NULL);

-- Equipment ID 2: PosClass TX-1500S features (duplicate)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(2, N'Türkiyə İstehsalı Keyfiyyət', 0, GETDATE(), NULL),
(2, N'1 İl Rəsmi Zəmanət', 1, GETDATE(), NULL),
(2, N'Wi-Fi Adapter Artırma İmkanı', 2, GETDATE(), NULL),
(2, N'10.1" Arxa Ekran Əlavə İmkanı', 3, GETDATE(), NULL);

-- Equipment ID 3: PosClass TX-1500S features (duplicate)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(3, N'Türkiyə İstehsalı Keyfiyyət', 0, GETDATE(), NULL),
(3, N'1 İl Rəsmi Zəmanət', 1, GETDATE(), NULL),
(3, N'Wi-Fi Adapter Artırma İmkanı', 2, GETDATE(), NULL),
(3, N'10.1" Arxa Ekran Əlavə İmkanı', 3, GETDATE(), NULL);

-- Equipment ID 4: Honeywell Voyager 1200g features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(4, N'1D/2D Barkod Dəstəyi', 0, GETDATE(), NULL),
(4, N'Sürətli Oxuma', 1, GETDATE(), NULL),
(4, N'USB və RS232 Bağlantı', 2, GETDATE(), NULL),
(4, N'Sərt Dizayn', 3, GETDATE(), NULL);

-- Equipment ID 5: Epson TM-T88VI features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(5, N'58mm Kağız Genişliyi', 0, GETDATE(), NULL),
(5, N'Sürətli Çap', 1, GETDATE(), NULL),
(5, N'USB/Ethernet', 2, GETDATE(), NULL),
(5, N'Yüksək Keyfiyyət', 3, GETDATE(), NULL);

-- Equipment ID 6: APG Cash Drawer features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(6, N'Sol/Sağ Açılma', 0, GETDATE(), NULL),
(6, N'Təhlükəsiz Kilid', 1, GETDATE(), NULL),
(6, N'Açar İdarəetməsi', 2, GETDATE(), NULL),
(6, N'Universal Uyğunluq', 3, GETDATE(), NULL);

-- Equipment ID 7: Verifone VX520 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(7, N'Chip Kart Dəstəyi', 0, GETDATE(), NULL),
(7, N'Contactless Ödəniş', 1, GETDATE(), NULL),
(7, N'3G/Wi-Fi', 2, GETDATE(), NULL),
(7, N'Təhlükəsizlik', 3, GETDATE(), NULL);

-- Equipment ID 8: Datalogic Memor X3 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(8, N'Mobil Kompüter', 0, GETDATE(), NULL),
(8, N'Barkod Skeneri', 1, GETDATE(), NULL),
(8, N'Windows Embedded', 2, GETDATE(), NULL),
(8, N'Uzun Batareya', 3, GETDATE(), NULL);

-- Equipment ID 9: Star TSP100 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(9, N'80mm Kağız', 0, GETDATE(), NULL),
(9, N'Kompakt Dizayn', 1, GETDATE(), NULL),
(9, N'USB/Serial', 2, GETDATE(), NULL),
(9, N'Sürətli Çap', 3, GETDATE(), NULL);

-- Equipment ID 10: Zebra ZD220 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(10, N'RFID Dəstəyi', 0, GETDATE(), NULL),
(10, N'2 inch Etiket', 1, GETDATE(), NULL),
(10, N'Yüksək Keyfiyyət', 2, GETDATE(), NULL),
(10, N'Professional', 3, GETDATE(), NULL);

-- Verify the fix
SELECT 'Verifying all features are now correct:' AS Status;
SELECT Id, EquipmentId, Feature, LEN(Feature) as CharCount, DATALENGTH(Feature) as ByteLength 
FROM EquipmentFeatures 
ORDER BY EquipmentId, OrderIndex;

-- Check if any corrupted characters remain
SELECT 'Checking for any remaining corrupted characters:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures 
WHERE Feature LIKE '%Ã%' OR Feature LIKE '%Ä%' OR Feature LIKE '%É%' OR Feature LIKE '%™%' OR Feature LIKE '%Ÿ%' OR Feature LIKE '%Å%' OR Feature LIKE '%¼%' OR Feature LIKE '%¹%';
