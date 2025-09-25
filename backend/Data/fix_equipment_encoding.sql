-- Fix Azerbaijani Character Encoding in Equipment Data
-- This script updates equipment features, specifications, and other text fields with proper Unicode encoding

-- Update Equipment Features with proper Azerbaijani characters
UPDATE EquipmentFeatures 
SET Feature = N'15 inch LED LCD proyeksiyalı Kapasitiv panel'
WHERE Feature LIKE '%proyeksiyalÄ±%';

UPDATE EquipmentFeatures 
SET Feature = N'10 barmaq'
WHERE Feature LIKE '%barmaq%';

UPDATE EquipmentFeatures 
SET Feature = N'Intel BayTrail J1900 2.0 GHZ'
WHERE Feature LIKE '%BayTrail%';

UPDATE EquipmentFeatures 
SET Feature = N'4GB DDR3 SODIMM - 8GB (1333/1666 MHz)'
WHERE Feature LIKE '%DDR3%';

UPDATE EquipmentFeatures 
SET Feature = N'120GB SSD HDD 2.5" /MSATA - 240GB SSD artırma imkanı'
WHERE Feature LIKE '%artÄ±rma%';

UPDATE EquipmentFeatures 
SET Feature = N'Microsoft Windows 7, Windows 8.1, Windows 10, Windows 11, Posready 7'
WHERE Feature LIKE '%Windows%';

UPDATE EquipmentFeatures 
SET Feature = N'Intel HD Graphics 4000'
WHERE Feature LIKE '%Graphics%';

UPDATE EquipmentFeatures 
SET Feature = N'10/100/1000 Mbps Ethernet, Wi-Fi 802.11 b/g/n'
WHERE Feature LIKE '%Ethernet%';

UPDATE EquipmentFeatures 
SET Feature = N'4x USB 2.0, 2x USB 3.0, 1x HDMI, 1x VGA, 1x RJ45'
WHERE Feature LIKE '%USB%';

UPDATE EquipmentFeatures 
SET Feature = N'12V DC, 65W Power Adapter'
WHERE Feature LIKE '%Power%';

UPDATE EquipmentFeatures 
SET Feature = N'400 x 300 x 80 mm (W x D x H)'
WHERE Feature LIKE '%mm%';

UPDATE EquipmentFeatures 
SET Feature = N'2.5 kg'
WHERE Feature LIKE '%kg%';

-- Update Equipment Specifications with proper Azerbaijani characters
UPDATE EquipmentSpecifications 
SET Value = N'15 inch LED LCD proyeksiyalı Kapasitiv panel'
WHERE Value LIKE '%proyeksiyalÄ±%';

UPDATE EquipmentSpecifications 
SET Value = N'10 barmaq'
WHERE Value LIKE '%barmaq%';

UPDATE EquipmentSpecifications 
SET Value = N'Intel BayTrail J1900 2.0 GHZ'
WHERE Value LIKE '%BayTrail%';

UPDATE EquipmentSpecifications 
SET Value = N'4GB DDR3 SODIMM - 8GB (1333/1666 MHz)'
WHERE Value LIKE '%DDR3%';

UPDATE EquipmentSpecifications 
SET Value = N'120GB SSD HDD 2.5" /MSATA - 240GB SSD artırma imkanı'
WHERE Value LIKE '%artÄ±rma%';

UPDATE EquipmentSpecifications 
SET Value = N'Microsoft Windows 7, Windows 8.1, Windows 10, Windows 11, Posready 7'
WHERE Value LIKE '%Windows%';

UPDATE EquipmentSpecifications 
SET Value = N'Intel HD Graphics 4000'
WHERE Value LIKE '%Graphics%';

UPDATE EquipmentSpecifications 
SET Value = N'10/100/1000 Mbps Ethernet, Wi-Fi 802.11 b/g/n'
WHERE Value LIKE '%Ethernet%';

UPDATE EquipmentSpecifications 
SET Value = N'4x USB 2.0, 2x USB 3.0, 1x HDMI, 1x VGA, 1x RJ45'
WHERE Value LIKE '%USB%';

UPDATE EquipmentSpecifications 
SET Value = N'12V DC, 65W Power Adapter'
WHERE Value LIKE '%Power%';

UPDATE EquipmentSpecifications 
SET Value = N'400 x 300 x 80 mm (W x D x H)'
WHERE Value LIKE '%mm%';

UPDATE EquipmentSpecifications 
SET Value = N'2.5 kg'
WHERE Value LIKE '%kg%';

-- Update Equipment Names and Descriptions with proper Azerbaijani characters
UPDATE Equipment 
SET Name = N'POS Terminal'
WHERE Name LIKE '%Terminal%';

UPDATE Equipment 
SET Description = N'Yüksək performanslı POS terminal sistemi'
WHERE Description LIKE '%performanslÄ±%';

-- Commit the changes
COMMIT;

