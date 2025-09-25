-- Complete cleanup and recreation of EquipmentFeatures with proper Unicode encoding
-- This will remove ALL existing features and recreate them properly

-- First, let's see the total count
SELECT 'Total features before cleanup: ' + CAST(COUNT(*) AS VARCHAR) AS Status
FROM EquipmentFeatures;

-- Delete ALL existing features (complete cleanup)
DELETE FROM EquipmentFeatures;

-- Recreate the features with proper Unicode encoding
-- Equipment 1 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES 
(1, N'Türkiyə İstehsalı Keyfiyyət', 0, GETDATE()),
(1, N'1 İl Rəsmi Zəmanət', 1, GETDATE()),
(1, N'Wi-Fi Adapter Artırma İmkanı', 2, GETDATE()),
(1, N'10.1" Arxa Ekran Əlavə İmkanı', 3, GETDATE());

-- Equipment 2 features  
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(2, N'Türkiyə İstehsalı Keyfiyyət', 0, GETDATE()),
(2, N'1 İl Rəsmi Zəmanət', 1, GETDATE()),
(2, N'Wi-Fi Adapter Artırma İmkanı', 2, GETDATE()),
(2, N'10.1" Arxa Ekran Əlavə İmkanı', 3, GETDATE());

-- Equipment 3 features
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(3, N'Türkiyə İstehsalı Keyfiyyət', 0, GETDATE()),
(3, N'1 İl Rəsmi Zəmanət', 1, GETDATE()),
(3, N'Wi-Fi Adapter Artırma İmkanı', 2, GETDATE()),
(3, N'10.1" Arxa Ekran Əlavə İmkanı', 3, GETDATE());

-- Equipment 4 features (Honeywell Scanner)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(4, N'1D/2D Barkod Dəstəyi', 0, GETDATE()),
(4, N'Sürətli Oxuma', 1, GETDATE()),
(4, N'USB və RS232 Bağlantı', 2, GETDATE()),
(4, N'Sərt Dizayn', 3, GETDATE());

-- Equipment 5 features (Epson Printer)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(5, N'58mm Kağız Genişliyi', 0, GETDATE()),
(5, N'Sürətli Çap', 1, GETDATE()),
(5, N'USB/Ethernet', 2, GETDATE()),
(5, N'Yüksək Keyfiyyət', 3, GETDATE());

-- Equipment 6 features (Cash Drawer)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(6, N'Sol/Sağ Açılma', 0, GETDATE()),
(6, N'Təhlükəsiz Kilid', 1, GETDATE()),
(6, N'Açar İdarəetməsi', 2, GETDATE()),
(6, N'Universal Uyğunluq', 3, GETDATE());

-- Equipment 7 features (Payment Terminal)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(7, N'Chip Kart Dəstəyi', 0, GETDATE()),
(7, N'Contactless Ödəniş', 1, GETDATE()),
(7, N'3G/Wi-Fi', 2, GETDATE()),
(7, N'Təhlükəsizlik', 3, GETDATE());

-- Equipment 8 features (Mobile Computer)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(8, N'Mobil Kompüter', 0, GETDATE()),
(8, N'Barkod Skeneri', 1, GETDATE()),
(8, N'Windows Embedded', 2, GETDATE()),
(8, N'Uzun Batareya', 3, GETDATE());

-- Equipment 9 features (Receipt Printer)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(9, N'80mm Kağız', 0, GETDATE()),
(9, N'Kompakt Dizayn', 1, GETDATE()),
(9, N'USB/Serial', 2, GETDATE()),
(9, N'Sürətli Çap', 3, GETDATE());

-- Equipment 10 features (Label Printer)
INSERT INTO EquipmentFeatures (EquipmentId, Feature, OrderIndex, CreatedAt) VALUES
(10, N'RFID Dəstəyi', 0, GETDATE()),
(10, N'2 inch Etiket', 1, GETDATE()),
(10, N'Yüksək Keyfiyyət', 2, GETDATE()),
(10, N'Professional', 3, GETDATE());

-- Show final results
SELECT 'Cleanup completed. Total features after recreation: ' + CAST(COUNT(*) AS VARCHAR) AS Result
FROM EquipmentFeatures;

-- Verify no corrupted characters remain
SELECT 'Features with corrupted characters: ' + CAST(COUNT(*) AS VARCHAR) AS CorruptedCount
FROM EquipmentFeatures 
WHERE Feature LIKE '%Ã%' OR Feature LIKE '%Ä%' OR Feature LIKE '%É%' OR Feature LIKE '%™%' OR Feature LIKE '%Ÿ%' OR Feature LIKE '%Å%' OR Feature LIKE '%¼%' OR Feature LIKE '%¹%';
