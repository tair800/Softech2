-- Fix Azerbaijani Character Encoding in EquipmentFeatures Table
-- This script updates all equipment features with proper Unicode encoding using N prefix

-- Update Equipment Features with proper Azerbaijani characters
-- Türkiyə İstehsalı Keyfiyyət
UPDATE EquipmentFeatures 
SET Feature = N'Türkiyə İstehsalı Keyfiyyət'
WHERE Feature LIKE '%Türkiyə%' OR Feature LIKE '%Keyfiyyət%';

-- 1 İl Rəsmi Zəmanət
UPDATE EquipmentFeatures 
SET Feature = N'1 İl Rəsmi Zəmanət'
WHERE Feature LIKE '%İl%' OR Feature LIKE '%Rəsmi%' OR Feature LIKE '%Zəmanət%';

-- Wi-Fi Adapter Artırma İmkanı
UPDATE EquipmentFeatures 
SET Feature = N'Wi-Fi Adapter Artırma İmkanı'
WHERE Feature LIKE '%Artırma%' OR Feature LIKE '%İmkanı%';

-- 10.1" Arxa Ekran Əlavə İmkanı
UPDATE EquipmentFeatures 
SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı'
WHERE Feature LIKE '%Arxa%' OR Feature LIKE '%Ekran%' OR Feature LIKE '%Əlavə%';

-- 1D/2D Barkod Dəstəyi
UPDATE EquipmentFeatures 
SET Feature = N'1D/2D Barkod Dəstəyi'
WHERE Feature LIKE '%Barkod%' OR Feature LIKE '%Dəstəyi%';

-- Sürətli Oxuma
UPDATE EquipmentFeatures 
SET Feature = N'Sürətli Oxuma'
WHERE Feature LIKE '%Sürətli%' OR Feature LIKE '%Oxuma%';

-- USB və RS232 Bağlantı
UPDATE EquipmentFeatures 
SET Feature = N'USB və RS232 Bağlantı'
WHERE Feature LIKE '%və%' OR Feature LIKE '%Bağlantı%';

-- Sərt Dizayn
UPDATE EquipmentFeatures 
SET Feature = N'Sərt Dizayn'
WHERE Feature LIKE '%Sərt%' OR Feature LIKE '%Dizayn%';

-- 58mm Kağız Genişliyi
UPDATE EquipmentFeatures 
SET Feature = N'58mm Kağız Genişliyi'
WHERE Feature LIKE '%Kağız%' OR Feature LIKE '%Genişliyi%';

-- Sürətli Çap
UPDATE EquipmentFeatures 
SET Feature = N'Sürətli Çap'
WHERE Feature LIKE '%Sürətli%' OR Feature LIKE '%Çap%';

-- USB/Ethernet
UPDATE EquipmentFeatures 
SET Feature = N'USB/Ethernet'
WHERE Feature LIKE '%USB%' OR Feature LIKE '%Ethernet%';

-- Yüksək Keyfiyyət
UPDATE EquipmentFeatures 
SET Feature = N'Yüksək Keyfiyyət'
WHERE Feature LIKE '%Yüksək%' OR Feature LIKE '%Keyfiyyət%';

-- Sol/Sağ Açılma
UPDATE EquipmentFeatures 
SET Feature = N'Sol/Sağ Açılma'
WHERE Feature LIKE '%Sol%' OR Feature LIKE '%Sağ%' OR Feature LIKE '%Açılma%';

-- Təhlükəsiz Kilid
UPDATE EquipmentFeatures 
SET Feature = N'Təhlükəsiz Kilid'
WHERE Feature LIKE '%Təhlükəsiz%' OR Feature LIKE '%Kilid%';

-- Açar İdarəetməsi
UPDATE EquipmentFeatures 
SET Feature = N'Açar İdarəetməsi'
WHERE Feature LIKE '%Açar%' OR Feature LIKE '%İdarəetməsi%';

-- Universal Uyğunluq
UPDATE EquipmentFeatures 
SET Feature = N'Universal Uyğunluq'
WHERE Feature LIKE '%Universal%' OR Feature LIKE '%Uyğunluq%';

-- Chip Kart Dəstəyi
UPDATE EquipmentFeatures 
SET Feature = N'Chip Kart Dəstəyi'
WHERE Feature LIKE '%Kart%' OR Feature LIKE '%Dəstəyi%';

-- Contactless Ödəniş
UPDATE EquipmentFeatures 
SET Feature = N'Contactless Ödəniş'
WHERE Feature LIKE '%Contactless%' OR Feature LIKE '%Ödəniş%';

-- 3G/Wi-Fi
UPDATE EquipmentFeatures 
SET Feature = N'3G/Wi-Fi'
WHERE Feature LIKE '%3G%' OR Feature LIKE '%Wi-Fi%';

-- Təhlükəsizlik
UPDATE EquipmentFeatures 
SET Feature = N'Təhlükəsizlik'
WHERE Feature LIKE '%Təhlükəsizlik%';

-- Mobil Kompüter
UPDATE EquipmentFeatures 
SET Feature = N'Mobil Kompüter'
WHERE Feature LIKE '%Mobil%' OR Feature LIKE '%Kompüter%';

-- Barkod Skeneri
UPDATE EquipmentFeatures 
SET Feature = N'Barkod Skeneri'
WHERE Feature LIKE '%Barkod%' OR Feature LIKE '%Skeneri%';

-- Windows Embedded
UPDATE EquipmentFeatures 
SET Feature = N'Windows Embedded'
WHERE Feature LIKE '%Windows%' OR Feature LIKE '%Embedded%';

-- Uzun Batareya
UPDATE EquipmentFeatures 
SET Feature = N'Uzun Batareya'
WHERE Feature LIKE '%Uzun%' OR Feature LIKE '%Batareya%';

-- 80mm Kağız
UPDATE EquipmentFeatures 
SET Feature = N'80mm Kağız'
WHERE Feature LIKE '%80mm%' OR Feature LIKE '%Kağız%';

-- Kompakt Dizayn
UPDATE EquipmentFeatures 
SET Feature = N'Kompakt Dizayn'
WHERE Feature LIKE '%Kompakt%' OR Feature LIKE '%Dizayn%';

-- USB/Serial
UPDATE EquipmentFeatures 
SET Feature = N'USB/Serial'
WHERE Feature LIKE '%USB%' OR Feature LIKE '%Serial%';

-- Sürətli Çap
UPDATE EquipmentFeatures 
SET Feature = N'Sürətli Çap'
WHERE Feature LIKE '%Sürətli%' OR Feature LIKE '%Çap%';

-- RFID Dəstəyi
UPDATE EquipmentFeatures 
SET Feature = N'RFID Dəstəyi'
WHERE Feature LIKE '%RFID%' OR Feature LIKE '%Dəstəyi%';

-- 2 inch Etiket
UPDATE EquipmentFeatures 
SET Feature = N'2 inch Etiket'
WHERE Feature LIKE '%2 inch%' OR Feature LIKE '%Etiket%';

-- Professional
UPDATE EquipmentFeatures 
SET Feature = N'Professional'
WHERE Feature LIKE '%Professional%';

-- Commit the changes
COMMIT;
