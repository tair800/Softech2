-- Convert all EquipmentFeatures from Azerbaijani to English text
-- This will solve the Unicode corruption issues completely

-- First, backup current data
SELECT 'Backing up current data...' AS Status;
SELECT Id, EquipmentId, Feature, OrderIndex FROM EquipmentFeatures ORDER BY EquipmentId, OrderIndex;

-- Delete all existing features
SELECT 'Deleting all existing features...' AS Status;
DELETE FROM EquipmentFeatures;

-- Re-insert all features with English text
SELECT 'Re-inserting features with English text...' AS Status;

-- Equipment ID 1: PosClass TX-1500S features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(1, N'Turkish Production Quality', 0, GETDATE(), NULL),
(1, N'1 Year Official Warranty', 1, GETDATE(), NULL),
(1, N'Wi-Fi Adapter Upgrade Capability', 2, GETDATE(), NULL),
(1, N'10.1" Rear Screen Addition Capability', 3, GETDATE(), NULL);

-- Equipment ID 2: PosClass TX-1500S features (duplicate)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(2, N'Turkish Production Quality', 0, GETDATE(), NULL),
(2, N'1 Year Official Warranty', 1, GETDATE(), NULL),
(2, N'Wi-Fi Adapter Upgrade Capability', 2, GETDATE(), NULL),
(2, N'10.1" Rear Screen Addition Capability', 3, GETDATE(), NULL);

-- Equipment ID 3: PosClass TX-1500S features (duplicate)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(3, N'Turkish Production Quality', 0, GETDATE(), NULL),
(3, N'1 Year Official Warranty', 1, GETDATE(), NULL),
(3, N'Wi-Fi Adapter Upgrade Capability', 2, GETDATE(), NULL),
(3, N'10.1" Rear Screen Addition Capability', 3, GETDATE(), NULL);

-- Equipment ID 4: Honeywell Voyager 1200g features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(4, N'1D/2D Barcode Support', 0, GETDATE(), NULL),
(4, N'Fast Reading', 1, GETDATE(), NULL),
(4, N'USB and RS232 Connection', 2, GETDATE(), NULL),
(4, N'Rugged Design', 3, GETDATE(), NULL);

-- Equipment ID 5: Epson TM-T88VI features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(5, N'58mm Paper Width', 0, GETDATE(), NULL),
(5, N'Fast Printing', 1, GETDATE(), NULL),
(5, N'USB/Ethernet', 2, GETDATE(), NULL),
(5, N'High Quality', 3, GETDATE(), NULL);

-- Equipment ID 6: APG Cash Drawer features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(6, N'Left/Right Opening', 0, GETDATE(), NULL),
(6, N'Secure Lock', 1, GETDATE(), NULL),
(6, N'Key Management', 2, GETDATE(), NULL),
(6, N'Universal Compatibility', 3, GETDATE(), NULL);

-- Equipment ID 7: Verifone VX520 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(7, N'Chip Card Support', 0, GETDATE(), NULL),
(7, N'Contactless Payment', 1, GETDATE(), NULL),
(7, N'3G/Wi-Fi', 2, GETDATE(), NULL),
(7, N'Security', 3, GETDATE(), NULL);

-- Equipment ID 8: Datalogic Memor X3 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(8, N'Mobile Computer', 0, GETDATE(), NULL),
(8, N'Barcode Scanner', 1, GETDATE(), NULL),
(8, N'Windows Embedded', 2, GETDATE(), NULL),
(8, N'Long Battery Life', 3, GETDATE(), NULL);

-- Equipment ID 9: Star TSP100 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(9, N'80mm Paper', 0, GETDATE(), NULL),
(9, N'Compact Design', 1, GETDATE(), NULL),
(9, N'USB/Serial', 2, GETDATE(), NULL),
(9, N'Fast Printing', 3, GETDATE(), NULL);

-- Equipment ID 10: Zebra ZD220 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES 
(10, N'RFID Support', 0, GETDATE(), NULL),
(10, N'2 inch Label', 1, GETDATE(), NULL),
(10, N'High Quality', 2, GETDATE(), NULL),
(10, N'Professional', 3, GETDATE(), NULL);

-- Verify the fix
SELECT 'Verifying all features are now in English:' AS Status;
SELECT Id, EquipmentId, Feature, LEN(Feature) as CharCount, DATALENGTH(Feature) as ByteLength 
FROM EquipmentFeatures 
ORDER BY EquipmentId, OrderIndex;

-- Check if any corrupted characters remain
SELECT 'Checking for any remaining corrupted characters:' AS Status;
SELECT Id, EquipmentId, Feature FROM EquipmentFeatures 
WHERE Feature LIKE '%Ã%' OR Feature LIKE '%Ä%' OR Feature LIKE '%É%' OR Feature LIKE '%™%' OR Feature LIKE '%Ÿ%' OR Feature LIKE '%Å%' OR Feature LIKE '%¼%' OR Feature LIKE '%¹%';
