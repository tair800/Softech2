-- Fix Azerbaijani Character Encoding in EquipmentFeatures Table - Version 2
-- This script targets the actual corrupted character patterns found in the database

-- Fix Türkiyə İstehsalı Keyfiyyət
UPDATE EquipmentFeatures 
SET Feature = N'Türkiyə İstehsalı Keyfiyyət'
WHERE Feature LIKE '%TÃ¼rkiyə%' OR Feature LIKE '%Äºstehsalə%' OR Feature LIKE '%Keyfiyyət%';

-- Fix 1 İl Rəsmi Zəmanət
UPDATE EquipmentFeatures 
SET Feature = N'1 İl Rəsmi Zəmanət'
WHERE Feature LIKE '%ÄºI%' OR Feature LIKE '%RÉ™smi%' OR Feature LIKE '%ZÉ™™ manÉ™™t%';

-- Fix Wi-Fi Adapter Artırma İmkanı
UPDATE EquipmentFeatures 
SET Feature = N'Wi-Fi Adapter Artırma İmkanı'
WHERE Feature LIKE '%Artırma%' OR Feature LIKE '%İmkanı%';

-- Fix 10.1" Arxa Ekran Əlavə İmkanı
UPDATE EquipmentFeatures 
SET Feature = N'10.1" Arxa Ekran Əlavə İmkanı'
WHERE Feature LIKE '%Arxa%' OR Feature LIKE '%Ekran%' OR Feature LIKE '%Əlavə%';

-- Fix 1D/2D Barkod Dəstəyi
UPDATE EquipmentFeatures 
SET Feature = N'1D/2D Barkod Dəstəyi'
WHERE Feature LIKE '%Barkod%' OR Feature LIKE '%DÉ™stÉMyi%';

-- Fix Sürətli Oxuma
UPDATE EquipmentFeatures 
SET Feature = N'Sürətli Oxuma'
WHERE Feature LIKE '%SÃ¼rÉ™™™tli%' OR Feature LIKE '%Oxuma%';

-- Fix USB və RS232 Bağlantı
UPDATE EquipmentFeatures 
SET Feature = N'USB və RS232 Bağlantı'
WHERE Feature LIKE '%və%' OR Feature LIKE '%Bağlantı%';

-- Fix Sərt Dizayn
UPDATE EquipmentFeatures 
SET Feature = N'Sərt Dizayn'
WHERE Feature LIKE '%Sərt%' OR Feature LIKE '%Dizayn%';

-- Fix 58mm Kağız Genişliyi
UPDATE EquipmentFeatures 
SET Feature = N'58mm Kağız Genişliyi'
WHERE Feature LIKE '%KaÄŸÄ±z%' OR Feature LIKE '%Genişliyi%';

-- Fix Sürətli Çap
UPDATE EquipmentFeatures 
SET Feature = N'Sürətli Çap'
WHERE Feature LIKE '%SÃ¼rÉ™™™tli%' OR Feature LIKE '%Çap%';

-- Fix USB/Ethernet
UPDATE EquipmentFeatures 
SET Feature = N'USB/Ethernet'
WHERE Feature LIKE '%USB%' OR Feature LIKE '%Ethernet%';

-- Fix Yüksək Keyfiyyət
UPDATE EquipmentFeatures 
SET Feature = N'Yüksək Keyfiyyət'
WHERE Feature LIKE '%YÃ¹¼ksÉ™k%' OR Feature LIKE '%KeyfiyyÉ™t%';

-- Fix Sol/Sağ Açılma
UPDATE EquipmentFeatures 
SET Feature = N'Sol/Sağ Açılma'
WHERE Feature LIKE '%Sol%' OR Feature LIKE '%SaÄŸ%' OR Feature LIKE '%AÃ§Ä±lma%';

-- Fix Təhlükəsiz Kilid
UPDATE EquipmentFeatures 
SET Feature = N'Təhlükəsiz Kilid'
WHERE Feature LIKE '%TÉMhlÃ¼kÉ™ siz%' OR Feature LIKE '%Kilid%';

-- Fix Açar İdarəetməsi
UPDATE EquipmentFeatures 
SET Feature = N'Açar İdarəetməsi'
WHERE Feature LIKE '%AÃ§ar%' OR Feature LIKE '%Ä darÉ™etmÉ™™si%';

-- Fix Universal Uyğunluq
UPDATE EquipmentFeatures 
SET Feature = N'Universal Uyğunluq'
WHERE Feature LIKE '%Universal%' OR Feature LIKE '%UyÄŸunluq%';

-- Fix Chip Kart Dəstəyi
UPDATE EquipmentFeatures 
SET Feature = N'Chip Kart Dəstəyi'
WHERE Feature LIKE '%Kart%' OR Feature LIKE '%DÉ™stÉMyi%';

-- Fix Contactless Ödəniş
UPDATE EquipmentFeatures 
SET Feature = N'Contactless Ödəniş'
WHERE Feature LIKE '%Contactless%' OR Feature LIKE '%Ã-dÉ™™ niÅŸ%';

-- Fix 3G/Wi-Fi
UPDATE EquipmentFeatures 
SET Feature = N'3G/Wi-Fi'
WHERE Feature LIKE '%3G%' OR Feature LIKE '%Wi-Fi%';

-- Fix Təhlükəsizlik
UPDATE EquipmentFeatures 
SET Feature = N'Təhlükəsizlik'
WHERE Feature LIKE '%TÉMhlÃ¼kÉ™ sizlik%';

-- Fix Mobil Kompüter
UPDATE EquipmentFeatures 
SET Feature = N'Mobil Kompüter'
WHERE Feature LIKE '%Mobil%' OR Feature LIKE '%KompÃ¹¼ter%';

-- Fix Barkod Skeneri
UPDATE EquipmentFeatures 
SET Feature = N'Barkod Skeneri'
WHERE Feature LIKE '%Barkod%' OR Feature LIKE '%Skeneri%';

-- Fix Windows Embedded
UPDATE EquipmentFeatures 
SET Feature = N'Windows Embedded'
WHERE Feature LIKE '%Windows%' OR Feature LIKE '%Embedded%';

-- Fix Uzun Batareya
UPDATE EquipmentFeatures 
SET Feature = N'Uzun Batareya'
WHERE Feature LIKE '%Uzun%' OR Feature LIKE '%Batareya%';

-- Fix 80mm Kağız
UPDATE EquipmentFeatures 
SET Feature = N'80mm Kağız'
WHERE Feature LIKE '%80mm%' OR Feature LIKE '%KaÄŸÄ±z%';

-- Fix Kompakt Dizayn
UPDATE EquipmentFeatures 
SET Feature = N'Kompakt Dizayn'
WHERE Feature LIKE '%Kompakt%' OR Feature LIKE '%Dizayn%';

-- Fix USB/Serial
UPDATE EquipmentFeatures 
SET Feature = N'USB/Serial'
WHERE Feature LIKE '%USB%' OR Feature LIKE '%Serial%';

-- Fix RFID Dəstəyi
UPDATE EquipmentFeatures 
SET Feature = N'RFID Dəstəyi'
WHERE Feature LIKE '%RFID%' OR Feature LIKE '%DÉ™stÉMyi%';

-- Fix 2 inch Etiket
UPDATE EquipmentFeatures 
SET Feature = N'2 inch Etiket'
WHERE Feature LIKE '%2 inch%' OR Feature LIKE '%Etiket%';

-- Fix Professional
UPDATE EquipmentFeatures 
SET Feature = N'Professional'
WHERE Feature LIKE '%Professional%';

-- Show results
SELECT 'Updated ' + CAST(@@ROWCOUNT AS VARCHAR) + ' rows' AS Result;
